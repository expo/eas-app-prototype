import { useState } from 'react';
import { Linking, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { startActivityAsync } from 'expo-intent-launcher';
import { BuildForUseDownloadBuildFragment } from '../generated/graphql';

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

  const downloadResumable = FileSystem.createDownloadResumable(
    buildUrl,
    FileSystem.documentDirectory + buildName,
    {},
    (downloadProgress) => {
      const progress =
        (downloadProgress.totalBytesWritten * 100) / downloadProgress.totalBytesExpectedToWrite;

      setProgress(progress);
    }
  );

  const downloadBuild = async () => {
    if (Platform.OS === 'ios') {
      Linking.openURL(
        `itms-services://?action=download-manifest;url=https://api.expo.dev/v2/projects/${build?.project?.id}/builds/${build?.id}/manifest.plist`
      );
      return;
    }

    let buildUri = localUri;

    if (!buildUri) {
      setStatus(DownloadStatus.IN_PROGRESS);
      try {
        const fileSystemDownloadResult = progress
          ? await downloadResumable.downloadAsync()
          : await downloadResumable.resumeAsync();

        if (!fileSystemDownloadResult) {
          return;
        }

        buildUri = fileSystemDownloadResult.uri;
        setLocalUri(buildUri);

        setStatus(DownloadStatus.COMPLETED);
      } catch (e) {
        console.error(e);
      }
    }

    return installAndroidBuild(buildUri);
  };

  const pauseDownload = async () => {
    try {
      setStatus(DownloadStatus.PAUSED);
      await downloadResumable.pauseAsync();
    } catch (e) {
      console.error(e);
    }
  };

  return {
    downloadBuild,
    pauseDownload,
    progress,
    status,
  };
};

const installAndroidBuild = async (uri: string) => {
  const cUri = await FileSystem.getContentUriAsync(uri);

  await startActivityAsync('android.intent.action.VIEW', {
    data: cUri,
    type: 'application/vnd.android.package-archive',
    flags: 1,
  });
};
