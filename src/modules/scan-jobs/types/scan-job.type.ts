export type ScanJobWithData = {
  id: number;
  scanRule: {
    logic: any;
  };
  watchlist: {
    items: {
      coinSymbol: string;
    }[];
  };
};
