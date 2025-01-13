import { CrudDataTable } from "../../widgets/crud-data-table";

export function FactoryBranchesScreen() {
  async function fetchFactoryBranches() {
    try {
      const data = await fetch("/private/factory_branch/search/v1");

      console.log("red test");
      console.log(await data.json());
      return await data.json();
    } catch (err) {
      console.log(err);
    }
  }

  // return <CrudDataTable />;
  return <h1>FactoryBranchesScreen</h1>;
}
