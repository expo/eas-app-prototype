import { Ionicons } from "@expo/vector-icons";

import { BuildForBuildsListItemFragment } from "../generated/graphql";
import ListItem from "./ListItem";
import { DownloadStatus, useDownloadBuild } from "../hooks/useDownloadBuild";
import CircularProgress from "./CircularProgress";
import { lightTheme } from "@expo/styleguide-native";
import { Text } from "expo-dev-client-components";
import { BuildDistribution, BuildPlatform } from "../utils/builds";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

interface Props {
  build: BuildForBuildsListItemFragment;
  first?: boolean;
  last?: boolean;
}

const BuildsListItem = ({ build, first, last }: Props) => {
  const { downloadBuild, pauseDownload, progress, status } = useDownloadBuild({
    build,
  });

  return (
    <ListItem
      onPress={() => {
        status === DownloadStatus.IN_PROGRESS
          ? pauseDownload()
          : downloadBuild();
      }}
      accessoryRight={
        status === DownloadStatus.IN_PROGRESS ? (
          <CircularProgress percentage={progress} size={28} />
        ) : status === DownloadStatus.COMPLETED ? (
          <Text>Install</Text>
        ) : (
          <Ionicons
            name="download-outline"
            size={24}
            color={lightTheme.icon.default}
          />
        )
      }
      first={first}
      last={last}
    >
      <Text>
        {BuildPlatform[build.platform]} {BuildDistribution[build.distribution]}{" "}
        build
      </Text>
      <Text>
        {formatDistanceToNow(new Date(build.activityTimestamp), {
          addSuffix: true,
        })}
      </Text>
    </ListItem>
  );
};

export default BuildsListItem;
