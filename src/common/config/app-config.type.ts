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
      redisUrl: string;
      url: string;
      token: string;
    };
  };
};
