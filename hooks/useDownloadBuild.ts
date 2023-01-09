import { useCallback, useEffect, useState } from 'react';
import { Linking, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { startActivityAsync } from 'expo-intent-launcher';
import * as Sharing from 'expo-sharing';

import { BuildForUseDownloadBuildFragment } from '../generated/graphql';
import { BuildDistribution, BuildPlatform } from '../utils/builds';
import { throttle } from '../utils/throttle';
import { DownloadProgressData } from 'expo-file-system';

export enum DownloadStatus {
  COMPLETED = 'completed',
  ERROR = 'error',
  IN_PROGRESS = 'in_progress',
  PAUSED = 'paused',
}

interface UseDownloadBuildParams {
  build: BuildForUseDownloadBuildFragment;
}

export const useDownloadBuild = ({ build }: UseDownloadBuildParams) => {
  const [localUri, setLocalUri] = useState<string>(undefined);
  const [progress, setProgress] = useState<number>();
  const [status, setStatus] = useState<DownloadStatus>();
  const buildUrl = build?.artifacts?.buildUrl;
  const buildName = buildUrl?.substring(buildUrl?.lastIndexOf('/') + 1);
  const filePath = `${FileSystem.documentDirectory}${build.project.slug}-${buildName}`;

  const downloadResumable = FileSystem.createDownloadResumable(
    buildUrl,
    filePath,
    {},
    throttle((downloadProgress: DownloadProgressData) => {
      const progress =
        (downloadProgress.totalBytesWritten * 100) / downloadProgress.totalBytesExpectedToWrite;

      setProgress(progress);
    })
  );

  useEffect(() => {
    const checkFile = async () => {
      const fileInfo = await FileSystem.getInfoAsync(filePath);

      if (fileInfo.exists) {
        setLocalUri(fileInfo.uri);
        setStatus(DownloadStatus.COMPLETED);
      }
    };
    checkFile();
  }, [filePath]);

  const downloadBuild = useCallback(async () => {
    if (localUri) {
      return localUri;
    }

    setStatus(DownloadStatus.IN_PROGRESS);
    try {
      const fileSystemDownloadResult = progress
        ? await downloadResumable.downloadAsync()
        : await downloadResumable.resumeAsync();

      if (!fileSystemDownloadResult) {
        return;
      }

      setLocalUri(fileSystemDownloadResult.uri);
      setStatus(DownloadStatus.COMPLETED);
      return fileSystemDownloadResult.uri;
    } catch (e) {
      console.error(e);
      setStatus(DownloadStatus.ERROR);
    }
  }, [downloadResumable, localUri, progress]);

  const pauseDownload = useCallback(async () => {
    try {
      setStatus(DownloadStatus.PAUSED);
      await downloadResumable.pauseAsync();
    } catch (e) {
      console.error(e);
    }
  }, [downloadResumable]);

  const toggleDownload = useCallback(async () => {
    if (Platform.OS === 'ios' && BuildPlatform[build.platform] === BuildPlatform.IOS) {
      return openAdHocLink(build);
    }

    if (status === DownloadStatus.IN_PROGRESS) {
      return pauseDownload();
    }

    const buildUri = await downloadBuild();

    if (
      Platform.OS === 'android' &&
      BuildPlatform[build.platform] === BuildPlatform.ANDROID &&
      BuildDistribution[build.distribution] === BuildDistribution.INTERNAL
    ) {
      return installAndroidBuild(buildUri);
    }

    return shareBuild(buildUri);
  }, [build, downloadBuild, pauseDownload, status]);

  return {
    downloadBuild,
    pauseDownload,
    toggleDownload,
    progress,
    status,
    label: getLabel(build),
  };
};

const openAdHocLink = (build: BuildForUseDownloadBuildFragment) => {
  return Linking.openURL(
    `itms-services://?action=download-manifest;url=https://api.expo.dev/v2/projects/${build?.project?.id}/builds/${build?.id}/manifest.plist`
  );
};

const shareBuild = async (buildUri: string) => {
  const isSharingAvailable = await Sharing.isAvailableAsync();
  if (isSharingAvailable) {
    getMimeType(buildUri);
    Sharing.shareAsync(buildUri, {
      mimeType: getMimeType(buildUri),
    });
  }
};

const installAndroidBuild = async (uri: string) => {
  const cUri = await FileSystem.getContentUriAsync(uri);

  await startActivityAsync('android.intent.action.VIEW', {
    data: cUri,
    type: 'application/vnd.android.package-archive',
    flags: 1,
  });
};

const getMimeType = (uri: string) => {
  const extension = uri.substring(uri.lastIndexOf('.') + 1);
  switch (extension) {
    case 'apk':
      return 'application/vnd.android.package-archive';
    case 'aab':
      return 'application/x-authorware-bin';
    default:
      return 'application/octet-stream';
  }
};

const getLabel = (build: BuildForUseDownloadBuildFragment) => {
  if (
    Platform.OS === build.platform.toLowerCase() &&
    BuildDistribution[build.distribution] === BuildDistribution.INTERNAL
  ) {
    return 'Install';
  }

  return 'Share';
};
