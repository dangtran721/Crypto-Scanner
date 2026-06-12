export type AppConfig = {
  port: number;

  redis: {
    useUpstash: boolean;

    local?: {
      host: string;
      port: number;
      password?: string;
    };

    upstash?: {
      url: string;
      token: string;
    };
  };
};
