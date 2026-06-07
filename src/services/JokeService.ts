import axios from 'axios';
import { fallbackJokes } from '../utils/jokes';

export interface Joke {
  joke: string;
}

export class JokeService {
  private static readonly JOKE_API_URL = process.env.YOMAMA_JOKES_API || 'https://yomama-jokes.com/api/random';

  static async getRandomJoke(): Promise<Joke> {
    try {
      const response = await axios.get<{ joke: string }>(this.JOKE_API_URL, {
        timeout: 5000,
      });

      return {
        joke: response.data.joke,
      };
    } catch (error) {
      console.warn('Failed to fetch joke from API, using fallback:', error);
      return this.getRandomFallbackJoke();
    }
  }

  private static getRandomFallbackJoke(): Joke {
    const randomIndex = Math.floor(Math.random() * fallbackJokes.length);
    return {
      joke: fallbackJokes[randomIndex],
    };
  }
}
