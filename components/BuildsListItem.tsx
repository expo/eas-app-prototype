import { Ionicons } from '@expo/vector-icons';

import { BuildForBuildsListItemFragment } from '../generated/graphql';
import ListItem from './ListItem';
import { DownloadStatus, useDownloadBuild } from '../hooks/useDownloadBuild';
import CircularProgress from './CircularProgress';
import { lightTheme } from '@expo/styleguide-native';
import { Text } from 'expo-dev-client-components';
import { BuildDistribution, BuildPlatform } from '../utils/builds';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import Chip from './Chip';
import { TouchableOpacity } from 'react-native';

interface Props {
  build: BuildForBuildsListItemFragment;
  first?: boolean;
  last?: boolean;
  showProjectName?: boolean;
}

const BuildsListItem = ({ build, first, last, showProjectName }: Props) => {
  const { toggleDownload, label, progress, status } = useDownloadBuild({
    build,
  });

  return (
    <ListItem
      accessoryRight={
        status === DownloadStatus.COMPLETED ? (
          <Chip theme="secondary" label={label} onPress={toggleDownload} />
        ) : (
          <TouchableOpacity onPress={toggleDownload}>
            {status === DownloadStatus.IN_PROGRESS ? (
              <CircularProgress percentage={progress} size={28} />
            ) : (
              <Ionicons name="download-outline" size={24} color={lightTheme.icon.default} />
            )}
          </TouchableOpacity>
        )
      }
      first={first}
      last={last}>
      <Text type="InterSemiBold">
        {showProjectName ? `${build.project?.name} ` : ''}
        {BuildPlatform[build.platform]} {BuildDistribution[build.distribution]} build
      </Text>
      <Text type="InterRegular" size="small">
        {build.appVersion} ({build.appBuildVersion}) -{' '}
        {formatDistanceToNow(new Date(build.activityTimestamp), {
          addSuffix: true,
        })}
      </Text>
    </ListItem>
  );
};

export default BuildsListItem;
