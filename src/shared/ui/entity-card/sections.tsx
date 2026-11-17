import { Fragment, ReactNode } from "react";

/**
 * Every section an entity's card can carry, each drawn from the entity alone
 * and returning nothing when there is nothing to show. Defined once per entity;
 * each place that shows the card then names which of them it wants.
 */
export type EntityCardSectionRegistry<T> = Record<
  string,
  (entity: T) => ReactNode
>;

/**
 * The sections a given place shows, in the order it shows them — one list for
 * the graph, another for the tooltip, another for the table card view.
 */
export type EntityCardPreset = readonly string[];

/**
 * Draws the sections a preset names, out of an entity's registry. A name the
 * registry does not know is skipped, so a place can extend the registry with
 * sections of its own — ones that need data or links only it has — and list
 * them in the same preset.
 */
export function EntityCardSections<T>({
  entity,
  registry,
  preset,
}: {
  entity: T;
  registry: EntityCardSectionRegistry<T>;
  preset: EntityCardPreset;
}) {
  return (
    <>
      {preset.map((id) => (
        <Fragment key={id}>{registry[id]?.(entity)}</Fragment>
      ))}
    </>
  );
}
