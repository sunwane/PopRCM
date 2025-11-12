import { Actor } from '@/types/Actor';
import { mockActors } from '@/mocksData/mockActors';

export class ActorService {
  private static actors: Actor[] = [...mockActors];

  // Get all actors - sẵn sàng để nối với backend
  static async getAllActors(): Promise<Actor[]> {
    // TODO: Replace with real API call
    // return fetch('/api/actors')
    //   .then(response => response.json())
    //   .then(data => data as Actor[]);
    
    // Fake API call
    return Promise.resolve([...this.actors]);
  }

  // Get actor by ID
  static async getActorById(id: string): Promise<Actor | null> {
    // TODO: Replace with real API call
    // return fetch(`/api/actors/${id}`)
    //   .then(response => {
    //     if (!response.ok) return null;
    //     return response.json();
    //   })
    //   .then(data => data as Actor);
    
    // Fake API call
    const actor = this.actors.find(a => a.id === id);
    return Promise.resolve(actor || null);
  }

  // Add new actor
  static async addActor(actor: Omit<Actor, 'id'>): Promise<Actor> {
    // TODO: Replace with real API call
    // return fetch('/api/actors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(actor),
    // })
    //   .then(response => response.json())
    //   .then(data => data as Actor);
    
    // Fake API call
    const newActor: Actor = {
      ...actor,
      id: (Math.max(...this.actors.map(a => Number(a.id)), 0) + 1).toString(),
    };
    this.actors.push(newActor);
    return Promise.resolve(newActor);
  }

  // Update actor
  static async updateActor(id: string, actorData: Partial<Actor>): Promise<Actor | null> {
    // TODO: Replace with real API call
    // return fetch(`/api/actors/${id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(actorData),
    // })
    //   .then(response => {
    //     if (!response.ok) return null;
    //     return response.json();
    //   })
    //   .then(data => data as Actor);
    
    // Fake API call
    const index = this.actors.findIndex(a => a.id === id);
    if (index === -1) return Promise.resolve(null);
    
    this.actors[index] = { ...this.actors[index], ...actorData };
    return Promise.resolve(this.actors[index]);
  }

  // Delete actor
  static async deleteActor(id: string): Promise<boolean> {
    // TODO: Replace with real API call
    // return fetch(`/api/actors/${id}`, {
    //   method: 'DELETE',
    // })
    //   .then(response => response.ok);
    
    // Fake API call
    const index = this.actors.findIndex(a => a.id === id);
    if (index === -1) return Promise.resolve(false);
    
    this.actors.splice(index, 1);
    return Promise.resolve(true);
  }

  // Search actors
  static async searchActors(query: string): Promise<Actor[]> {
    // TODO: Replace with real API call
    // return fetch(`/api/actors?search=${encodeURIComponent(query)}`)
    //   .then(response => response.json())
    //   .then(data => data as Actor[]);
    
    // Fake API call
    const filteredActors = this.actors.filter(actor => 
      actor.originName.toLowerCase().includes(query.toLowerCase()) ||
      (actor.tmdbId ?? '').includes(query) ||
      (actor.alsoKnownAs ?? []).some(alias => alias.toLowerCase().includes(query.toLowerCase()))
    );
    return Promise.resolve(filteredActors);
  }

  // Check if actor name exists
  static async checkActorNameExists(name: string, excludeId?: string): Promise<boolean> {
    // TODO: Replace with real API call
    
    // Fake API call
    return Promise.resolve(
      this.actors.some(actor => 
        actor.originName.toLowerCase() === name.toLowerCase() && 
        actor.id !== excludeId
      )
    );
  }

  // Check if TMDB ID exists
  static async checkTmdbIdExists(tmdbId: string, excludeId?: string): Promise<boolean> {
    // TODO: Replace with real API call
    
    // Fake API call
    return Promise.resolve(
      this.actors.some(actor => 
        actor.tmdbId === tmdbId && 
        actor.id !== excludeId
      )
    );
  }

  // Get movie count for actor (mock function)
  static async getMovieCountByActor(actorId: string): Promise<number> {
    // TODO: Replace with real API call to get actual movie count
    // return fetch(`/api/actors/${actorId}/movies/count`)
    //   .then(response => response.json())
    //   .then(data => data.count);
    
    // Fake random movie count based on actor ID for consistency
    const seed = parseInt(actorId) || 1;
    return Promise.resolve(Math.abs(Math.floor((Math.sin(seed * 3) * 10000) % 50) + Math.floor(Math.random() * 20)));
  }

  // Get actors stats
  static async getActorsStats(): Promise<{
    total: number;
    male: number;
    female: number;
    unknown: number;
    totalMovies: number;
    avgMoviesPerActor: number;
  }> {
    // TODO: Replace with real API call
    
    // Fake API call
    const total = this.actors.length;
    const male = this.actors.filter(a => a.gender.toLowerCase() === 'male').length;
    const female = this.actors.filter(a => a.gender.toLowerCase() === 'female').length;
    const unknown = this.actors.filter(a => a.gender.toLowerCase() === 'unknown').length;
    
    // Calculate total movies (mock)
    const totalMovies = Math.floor(Math.random() * 500) + 200;
    const avgMoviesPerActor = total > 0 ? Math.round(totalMovies / total) : 0;
    
    return Promise.resolve({
      total,
      male,
      female,
      unknown,
      totalMovies,
      avgMoviesPerActor
    });
  }
}