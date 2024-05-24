import { MongoClient, ServerApiVersion } from "mongodb";

export class Mongo {
  private static client: MongoClient;
  private static readonly database = "user";

  public static async connect(
    uri: string | undefined = process.env.MONGO_CONNECTION_URI
  ) {
    if (!uri) {
      throw new Error("Missing required parameters");
    }
    this.client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    await this.client.connect();
  }

  public static async close() {
    await this.client.close();
  }
}
