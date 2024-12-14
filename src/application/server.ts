import { env } from 'src/infrastructure/config/environment';
import { connectPrisma, disconnectPrisma } from 'src/infrastructure/database/prisma-client';
import { logger } from 'src/infrastructure/logging/logger';
import { createApolloServer, setupApolloMiddleware } from 'src/infrastructure/server/apollo';
import { createExpressApp } from 'src/infrastructure/server/express';

export class Server {
  private constructor() {}

  public static async start(): Promise<void> {
    try {
      await connectPrisma();

      const app = createExpressApp();

      const apolloServer = await createApolloServer();
      setupApolloMiddleware(app, apolloServer);

      app.listen(env.PORT, () => {
        logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
      });

      process.on('SIGTERM', () => this.stop());
      process.on('SIGINT', () => this.stop());
    } catch (error) {
      logger.error('Failed to start server:', error);
      await this.stop();
    }
  }

  public static async stop(): Promise<void> {
    try {
      await disconnectPrisma();
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown:', error);
      process.exit(1);
    }
  }
}
