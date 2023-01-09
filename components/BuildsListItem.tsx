import { Ionicons } from '@expo/vector-icons';

import { BuildForBuildsListItemFragment } from '../generated/graphql';
import ListItem from './ListItem';
import { DownloadStatus, useDownloadBuild } from '../hooks/useDownloadBuild';
import CircularProgress from './CircularProgress';
import { lightTheme } from '@expo/styleguide-native';
import { Text } from 'expo-dev-client-components';
import { BuildDistribution, BuildPlatform } from '../utils/builds';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

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
      onPress={toggleDownload}
      accessoryRight={
        status === DownloadStatus.IN_PROGRESS ? (
          <CircularProgress percentage={progress} size={28} />
        ) : status === DownloadStatus.COMPLETED ? (
          <Text>{label}</Text>
        ) : (
          <Ionicons name="download-outline" size={24} color={lightTheme.icon.default} />
        )
      }
      first={first}
      last={last}>
      <Text type="InterSemiBold">
        {showProjectName ? `${build.project?.name} ` : ''}
        {BuildPlatform[build.platform]} {BuildDistribution[build.distribution]} build
      </Text>
      <Text type="InterRegular" size="small">
        {formatDistanceToNow(new Date(build.activityTimestamp), {
          addSuffix: true,
        })}
      </Text>
    </ListItem>
  );
};

export default BuildsListItem;
