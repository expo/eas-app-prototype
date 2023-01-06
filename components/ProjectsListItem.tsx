import { Image, StyleSheet } from "react-native";
import { ChevronDownIcon } from "@expo/styleguide-native";
import { Text, useExpoTheme } from "expo-dev-client-components";

import ListItem from "./ListItem";
import { ProjectForProjectsListItemFragment } from "../generated/graphql";

interface Props {
  project: ProjectForProjectsListItemFragment;
  onPress?: () => void;
  first?: boolean;
  last?: boolean;
}

const ProjectsListItem = ({ project, onPress, first, last }: Props) => {
  const theme = useExpoTheme();

  return (
    <ListItem
      onPress={onPress}
      accessoryLeft={
        <Image
          source={
            project.icon?.url
              ? {
                  uri: project.icon.url,
                }
              : require("../assets/placeholder-app-icon.png")
          }
          style={styles.projectIcon}
        />
      }
      accessoryRight={
        <ChevronDownIcon
          style={{ transform: [{ rotate: "-90deg" }] }}
          color={theme.icon.secondary}
        />
      }
      first={first}
      last={last}
    >
      <Text type="InterSemiBold" ellipsizeMode="tail" numberOfLines={1}>
        {project.name}
      </Text>
    </ListItem>
  );
};

export default ProjectsListItem;

const styles = StyleSheet.create({
  projectIcon: {
    height: 47,
    width: 47,
  },
});
