#!/bin/bash

# Colors for output
RED="\033[0;31m"
GREEN="\033[0;32m"
BLUE="\033[0;34m"
CYAN="\033[0;36m"
YELLOW="\033[0;33m"
RESET="\033[0m"

# File paths
API_CONTEXT_PROVIDER_PATH="./src/features/api-context-provider/api-context-provider.tsx"

# Prompt the user for the entity name
read -p "Enter the entity name: " ENTITY_NAME

# Check if the user provided an entity name
if [ -z "$ENTITY_NAME" ]; then
    echo -e "${RED}Error: No entity name provided. Exiting.${RESET}"
    exit 1
fi

# Prompt the user for the icon name
read -p "Enter the icon name (from https://lucide.dev/icons catalog): " ICON_NAME

# Validate icon name
if [ -z "$ICON_NAME" ]; then
    echo -e "${RED}Error: No icon name provided. Exiting.${RESET}"
    exit 1
fi

# Convert ENTITY_NAME to Capitalized (First letter uppercase, rest unchanged)
ENTITY_NAME_CAPITALIZED=$(echo "${ENTITY_NAME:0:1}" | tr '[:lower:]' '[:upper:]')${ENTITY_NAME:1}

BASE_DIR="./src/entities/$ENTITY_NAME"

# Create the folder structure
mkdir -p "$BASE_DIR/api" "$BASE_DIR/components/resource-link" "$BASE_DIR/libs/hooks"

# Create the main index.ts file in the entity folder
cat <<EOL >"$BASE_DIR/index.ts"
export * from "./api";
export * from "./components";
export * from "./libs";
EOL

# Create files in ./api
cat <<EOL >"$BASE_DIR/api/index.ts"
export * from "./api-service";
export * from "./types";
EOL

cat <<EOL >"$BASE_DIR/api/types.ts"
import { components, paths } from "@/shared/api/generated/schema";

export type ${ENTITY_NAME_CAPITALIZED} = components["schemas"]["${ENTITY_NAME_CAPITALIZED}V1"];
export type ${ENTITY_NAME_CAPITALIZED}_DETAILED = ${ENTITY_NAME_CAPITALIZED}; // Adjust as needed

export type ${ENTITY_NAME_CAPITALIZED}FilterKeys = "idList";
export type ${ENTITY_NAME_CAPITALIZED}Filters = Partial<Pick<unknown, ${ENTITY_NAME_CAPITALIZED}FilterKeys>>;
EOL

cat <<EOL >"$BASE_DIR/api/api-service.ts"
import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

export function create${ENTITY_NAME_CAPITALIZED}Api(settings: ApiSettings) {
  function search() {
    // TODO: Add implementation
  }

  function getById() {
    // TODO: Add implementation
  }

  function create() {
    // TODO: Add implementation
  }

  function update() {
    // TODO: Add implementation
  }

  return {
    search,
    getById,
    create,
    update,
  };
}

export type ${ENTITY_NAME_CAPITALIZED}Api = ReturnType<typeof create${ENTITY_NAME_CAPITALIZED}Api>;
EOL

# Create files in ./libs
cat <<EOL >"$BASE_DIR/libs/index.ts"
export * from "./constants";
export * from "./helpers";
export * from "./hooks";
EOL

cat <<EOL >"$BASE_DIR/libs/constants.ts"
export const ENTITY_COLOR = "#0EA5E9";
EOL

cat <<EOL >"$BASE_DIR/libs/hooks/index.ts"
export * from "./useFilters";
export * from "./useSelectAdapter";
EOL

# Create hooks/useFilters.ts
cat <<EOL >"$BASE_DIR/libs/hooks/useFilters.ts"
import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";
import {
  ${ENTITY_NAME_CAPITALIZED}FilterKeys,
  ${ENTITY_NAME_CAPITALIZED}Filters,
  use${ENTITY_NAME_CAPITALIZED}SelectAdapter,
} from "@/entities/${ENTITY_NAME}";
import { type FilterFeature } from "@/shared/libs";
import { z } from "zod";

export function use${ENTITY_NAME_CAPITALIZED}Filters(): FilterFeature<
  ${ENTITY_NAME_CAPITALIZED}FilterKeys,
  ${ENTITY_NAME_CAPITALIZED}Filters
> {
  const { getById, getItems, getItemKey, getItemLabel } =
    use${ENTITY_NAME_CAPITALIZED}SelectAdapter();

  function buildFilterFields(): Record<
    ${ENTITY_NAME_CAPITALIZED}FilterKeys,
    AutoFormValueInfo
  > {
    return {
      idList: {
        type: AutoFormValueType.tag,
        label: "Id",
        schema: z.string().uuid("Please enter a valid UUID"),
        placeholder: "Enter UUID",
      },
    };
  }

  function mapFiltersToPayload(
    filters: Record<${ENTITY_NAME_CAPITALIZED}FilterKeys, unknown>
  ): ${ENTITY_NAME_CAPITALIZED}Filters {
    const result: ${ENTITY_NAME_CAPITALIZED}Filters = {
      // TODO: add logic here
    };

    return result;
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
EOL

cat <<EOL >"$BASE_DIR/libs/hooks/useSelectAdapter.ts"
import { ${ENTITY_NAME_CAPITALIZED}_DETAILED } from "@/entities/${ENTITY_NAME}";
import { SelectAdapter } from "@/shared/libs";

export function use${ENTITY_NAME_CAPITALIZED}SelectAdapter(): SelectAdapter<${ENTITY_NAME_CAPITALIZED}_DETAILED> {
  async function getById(id: string) {
    // TODO: Apply valid logic here
    return { id } as ${ENTITY_NAME_CAPITALIZED}_DETAILED;
  }

  async function getItems(search: string) {
    // TODO: Apply valid logic here
    return [];
  }

  function getItemKey(item: ${ENTITY_NAME_CAPITALIZED}_DETAILED) {
    return item.id;
  }

  function getItemLabel({ key }: ${ENTITY_NAME_CAPITALIZED}_DETAILED) {
    return key;
  }

  return {
    getById,
    getItems,
    getItemKey,
    getItemLabel,
  };
}
EOL

cat <<EOL >"$BASE_DIR/libs/helpers.ts"
import { RelatedObjects } from "@/shared/api";
import { ${ENTITY_NAME_CAPITALIZED}, ${ENTITY_NAME_CAPITALIZED}_DETAILED } from "../api";

export const hydrate${ENTITY_NAME_CAPITALIZED}FromMap = (
  ${ENTITY_NAME}DTO: ${ENTITY_NAME_CAPITALIZED},
  relatedObjects?: RelatedObjects
): ${ENTITY_NAME_CAPITALIZED}_DETAILED => {
  const ${ENTITY_NAME_CAPITALIZED}: ${ENTITY_NAME_CAPITALIZED}_DETAILED = Object.assign(
    {},
    ${ENTITY_NAME}DTO
  ) as ${ENTITY_NAME_CAPITALIZED}_DETAILED;

  // TODO: Add hydration logic here

  return ${ENTITY_NAME_CAPITALIZED};
};
EOL

# Create files in ./components
cat <<EOL >"$BASE_DIR/components/index.ts"
export * from "./resource-link";
EOL

cat <<EOL >"$BASE_DIR/components/resource-link/index.ts"
export * from "./resource-link";
export * from "./tooltip";
EOL

cat <<EOL >"$BASE_DIR/components/resource-link/resource-link.tsx"
import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";
import { ${ENTITY_NAME_CAPITALIZED}ResourceTooltip } from "./tooltip";
import { ${ICON_NAME} } from "lucide-react";

type Props = {
  data: unknown;
  disabled?: boolean;
  withTooltip?: boolean;
};

export const ${ENTITY_NAME_CAPITALIZED}ResourceLink = ({
  data,
  disabled,
  withTooltip,
}: Props) => {
  const link = \`/${ENTITY_NAME}/\${data.id}\`;

  return (
    <ResourceLink
      IconComponent={${ICON_NAME}}
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => <${ENTITY_NAME_CAPITALIZED}ResourceTooltip data={data} link={link} />
          : undefined
      }
      getDisplayName={(data) =>
        isPopulatedString(data.name) ? data.name : data.key
      }
      link={link}
    />
  );
};
EOL

cat <<EOL >"$BASE_DIR/components/resource-link/tooltip.tsx"
import { isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";
import { ${ICON_NAME} } from "lucide-react";
import { ENTITY_COLOR } from "../../libs";

type Props = {
  data: unknown;
  link: string;
};

export const ${ENTITY_NAME_CAPITALIZED}ResourceTooltip = ({ data, link }: Props) => {
  return (
    <ResourceLinkTooltip uuid={data.id} link={link} accentColor={ENTITY_COLOR}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.name) ? data.name : "N/A"}
        iconSource={${ICON_NAME}}
      />

      <ResourceLinkTooltip.Main>
        {data.description && <p>{data.description}</p>}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
};
EOL

# Update api-context-provider.tsx
if [ -f "$API_CONTEXT_PROVIDER_PATH" ]; then
    # Add import statement
    sed -i.bak "s|import { ApiContext, ApiSettings } from \"@/shared/api\";|import { ApiContext, ApiSettings } from \"@/shared/api\";\nimport { create${ENTITY_NAME_CAPITALIZED}Api, ${ENTITY_NAME_CAPITALIZED}Api } from \"@/entities/${ENTITY_NAME}\";|" "$API_CONTEXT_PROVIDER_PATH"

    # Add field to ApiContextProps
    sed -i.bak "s|^export interface ApiContextProps {.*|&\n  ${ENTITY_NAME}: ${ENTITY_NAME_CAPITALIZED}Api;|" "$API_CONTEXT_PROVIDER_PATH"

    # Add provider value
    sed -i.bak "/value={{/a\\
        ${ENTITY_NAME}: create${ENTITY_NAME_CAPITALIZED}Api(settings),\\
" "$API_CONTEXT_PROVIDER_PATH"

    # Remove backup file after successful updates
    rm -f "${API_CONTEXT_PROVIDER_PATH}.bak"

    echo -e "${GREEN}Successfully updated ApiContextProvider with ${ENTITY_NAME_CAPITALIZED}Api.${RESET}"
else
    echo -e "${RED}Error: ApiContextProvider file not found at ${API_CONTEXT_PROVIDER_PATH}.${RESET}"
    exit 1
fi

# Display created structure
echo -e "${CYAN}Created folder structure:${RESET}"
echo -e "  ${YELLOW}Folder:${RESET} $BASE_DIR"
for subdir in "api" "components" "libs"; do
    echo -e "  ${YELLOW}Folder:${RESET} $BASE_DIR/$subdir"
    echo -e "    ${GREEN}File:${RESET} $BASE_DIR/$subdir/index.ts"
done

echo -e "  ${YELLOW}Folder:${RESET} $BASE_DIR/libs"
echo -e "    ${GREEN}File:${RESET} $BASE_DIR/libs/helpers.ts"

echo -e "  ${YELLOW}Folder:${RESET} $BASE_DIR/components/resource-link"
echo -e "    ${GREEN}File:${RESET} $BASE_DIR/components/resource-link/index.ts"
echo -e "    ${GREEN}File:${RESET} $BASE_DIR/components/resource-link/resource-link.tsx"
echo -e "    ${GREEN}File:${RESET} $BASE_DIR/components/resource-link/tooltip.tsx"

echo -e "    ${GREEN}File:${RESET} $BASE_DIR/index.ts"

# Success message with color
echo -e "${BLUE}Entity '${ENTITY_NAME}' structure created successfully at ${CYAN}${BASE_DIR}${RESET}."
