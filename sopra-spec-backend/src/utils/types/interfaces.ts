import {
  AttachmentT,
  DistributorT,
  LayerT,
  MaterialT,
  SubstrateT,
} from "./types";

export interface Distributor {
  id: number;
  name: DistributorT;
}

export interface Product {
  id: number;
  name: string;
  distributor: DistributorT;
  layer: LayerT;
}

export interface SystemStack {
  id: number;
  substrate: SubstrateT;
  insulated: boolean;
  exposed: boolean;
  material: MaterialT;
  attachment: AttachmentT;
}

export interface SystemStackLayer {
  systemStackId: number;
  productId: number;
}
