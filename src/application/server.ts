import { env } from 'src/infrastructure/config';
import { connectPrisma, disconnectPrisma } from 'src/infrastructure/database';
import { logger } from 'src/infrastructure/logging';
import {
  createApolloServer,
  createExpressApp,
  setupApolloMiddleware,
} from 'src/infrastructure/server';

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
