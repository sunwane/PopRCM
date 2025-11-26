import { Actor } from '@/types/Actor';
import { mockActors } from '@/mocksData/mockActors';

export class ActorService {
  private static actors: Actor[] = [...mockActors];
  private static isDataLoaded = false;
  private static readonly API_BASE_URL = 'http://localhost:8088/api/actors';

  // Kiểm tra service availability từ localStorage
  private static isServiceAvailable(): boolean {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('serviceAvailable') !== 'false';
    }
    return true;
  }

  // Chuyển đổi ActorResponse từ API sang Actor interface
  private static mapActorResponseToActor(actorResponse: any): Actor {
    return {
      id: actorResponse.actorId,
      tmdbId: actorResponse.tmdbId?.toString(),
      originName: actorResponse.originName,
      profilePath: actorResponse.profilePath,
      gender: this.mapGenderFromNumber(actorResponse.gender),
      alsoKnownAs: actorResponse.alsoKnownAs || [],
    };
  }

  // Chuyển đổi gender từ số sang string
  private static mapGenderFromNumber(genderNum: number): string {
    switch (genderNum) {
      case 1: return 'female';
      case 2: return 'male';
      default: return 'unknown';
    }
  }

  // Chuyển đổi gender từ string sang số cho API
  private static mapGenderToNumber(gender: string): number {
    switch (gender.toLowerCase()) {
      case 'female': return 1;
      case 'male': return 2;
      default: return 0;
    }
  }

  // Load data from API or mock
  private static async loadActorsData(
    page: number = 0,
    size: number = 24
  ): Promise<void> {
    if (this.isDataLoaded) return;

    if (!this.isServiceAvailable()) {
      console.info('API not available, using mock data');
      this.actors = [...mockActors];
      this.isDataLoaded = true;
      return;
    }

    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`${this.API_BASE_URL}?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      
      if (apiResponse.result && apiResponse.result.content && Array.isArray(apiResponse.result.content)) {
        this.actors = apiResponse.result.content.map((actorResponse: any) => 
          this.mapActorResponseToActor(actorResponse)
        );
        this.isDataLoaded = true;
        console.log('Loaded actors from API:', this.actors.length);
      } else {
        throw new Error('Invalid API response structure');
      }
      
    } catch (error) {
      console.warn('Failed to load actors from API, using mock data:', error);
      // Fallback to mock data nếu API fail
      this.actors = [...mockActors];
      this.isDataLoaded = true;
    }
  }

  // Get all actors - với pagination parameters
  static async getAllActors(
    page: number = 0,
    size: number = 24
  ): Promise<Actor[]> {
    // Quyết định size dựa trên availability của service
    const loadSize = this.isServiceAvailable() ? size : 1000;
    await this.loadActorsData(page, loadSize);
    
    // Nếu sử dụng mock data, thực hiện pagination local
    if (!this.isServiceAvailable()) {
      const start = page * size;
      const end = start + size;
      return this.actors.slice(start, end);
    }
    
    return [...this.actors];
  }

  // Get actor by ID
  static async getActorById(id: string): Promise<Actor | null> {
    if (!this.isServiceAvailable()) {
      await this.loadActorsData(0, 1000);
      const actor = this.actors.find(a => a.id === id);
      return Promise.resolve(actor || null);
    }

    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`${this.API_BASE_URL}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      
      if (apiResponse.result) {
        return this.mapActorResponseToActor(apiResponse.result);
      }
      return null;
      
    } catch (error) {
      console.warn('Failed to get actor from API, using local data:', error);
      await this.loadActorsData(0, 1000);
      const actor = this.actors.find(a => a.id === id);
      return Promise.resolve(actor || null);
    }
  }

  // Search actors
  static async searchActors(query: string): Promise<Actor[]> {
    if (!query.trim()) {
      return await this.getAllActors();
    }

    if (!this.isServiceAvailable()) {
      console.info('API not available, using local search');
      await this.loadActorsData(0, 1000);
      const searchTerm = query.toLowerCase().trim();
      const filteredActors = this.actors.filter(actor => 
        actor.originName.toLowerCase().includes(searchTerm) ||
        (actor.tmdbId ?? '').includes(searchTerm) ||
        (actor.alsoKnownAs ?? []).some(alias => alias.toLowerCase().includes(searchTerm))
      );
      return Promise.resolve(filteredActors);
    }

    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`${this.API_BASE_URL}?search=${encodeURIComponent(query)}&page=0&size=100`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      
      if (apiResponse.result && apiResponse.result.content && Array.isArray(apiResponse.result.content)) {
        return apiResponse.result.content.map((actorResponse: any) => 
          this.mapActorResponseToActor(actorResponse)
        );
      }
      return [];
      
    } catch (error) {
      console.warn('Search API failed, falling back to local search:', error);
      // Fallback to local search
      await this.loadActorsData(0, 1000);
      const searchTerm = query.toLowerCase().trim();
      const filteredActors = this.actors.filter(actor => 
        actor.originName.toLowerCase().includes(searchTerm) ||
        (actor.tmdbId ?? '').includes(searchTerm) ||
        (actor.alsoKnownAs ?? []).some(alias => alias.toLowerCase().includes(searchTerm))
      );
      return Promise.resolve(filteredActors);
    }
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

  // Refresh data - Force reload from API
  static refreshData(): void {
    this.isDataLoaded = false;
  }

  // Reset to mock data
  static resetToMockData(): void {
    this.actors = [...mockActors];
    this.isDataLoaded = true;
  }
}