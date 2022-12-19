import { AP } from "activitypub-core-types";

export async function fetchActorInformation(actorUrl: string): Promise<AP.Actor | null> {
  try {
    const response = await fetch(
      actorUrl,
      {
        headers: {
          "Content-type": 'application/activity+json',
          "Accept": 'application/activity+json'
        }
      }
    );

    return await response.json();
  } catch (error) {
    console.log("Unable to fetch action information", actorUrl);
  }
  return null;
}
