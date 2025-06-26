declare module "react-cytoscapejs" {
  import { Component } from "react";
  import { Core, Stylesheet, LayoutOptions } from "cytoscape";

  interface CytoscapeComponentProps {
    elements: any[];
    style?: React.CSSProperties;
    className?: string;
    cy?: (cy: Core) => void;
    layout?: LayoutOptions;
    stylesheet?: Stylesheet[];
  }

  export default class CytoscapeComponent extends Component<CytoscapeComponentProps> {}
}
