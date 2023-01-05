import { Text } from "react-native";

import { BuildForBuildsListItemFragment } from "../generated/graphql";
import ListItem from "./ListItem";
import { DownloadStatus, useDownloadBuild } from "../hooks/useDownloadBuild";

interface Props {
  build: BuildForBuildsListItemFragment;
}

const BuildsListItem = ({ build }: Props) => {
  const { downloadBuild, pauseDownload, progress, status } = useDownloadBuild({
    build,
  });

  return (
    <ListItem
      onPress={() =>
        status === DownloadStatus.IN_PROGRESS
          ? pauseDownload()
          : downloadBuild()
      }
    >
      <Text>
        {build.platform} {build.distribution} build
      </Text>
      <Text>
        {`${build.activityTimestamp} ${status ? "- " + status : ""} ${
          progress ? "- " + progress.toFixed(2) + "%" : ""
        }`}
      </Text>
    </ListItem>
  );
};

export default BuildsListItem;
