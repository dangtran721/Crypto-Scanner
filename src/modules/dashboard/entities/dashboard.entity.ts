export class UserDashBoard {
  id: number;
  email: string;
  name: string | null;

  watchlists: any[];
  scanRules: any[];

  constructor(user: any) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;

    this.watchlists = user.watchlists.map((list) => ({
      id: list.id,
      name: list.name,
      itemCount: list.items.length,
      items: list.items.map((i) => i.coinSymbol),
    }));

    this.scanRules = user.scanRules.map((rule) => ({
      id: rule.id,
      logic: rule.logic,
    }));
  }
}
