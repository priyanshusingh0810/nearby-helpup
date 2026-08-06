const BASE_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.port === '5173' ? 'http://localhost:8000/api/v1' : '/api/v1');

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = new Headers(options.headers || {});
  
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = 'Something went wrong';
    try {
      const errData = await response.json();
      errorDetail = errData.detail || errorDetail;
    } catch (e) {
      // JSON parsing failed
    }
    throw new Error(errorDetail);
  }

  // Return empty object for empty responses (like deletes)
  if (response.status === 204) return {};
  
  return response.json();
}

export const api = {
  // Auth API
  auth: {
    async login(username: string, password: string): Promise<{ access_token: string; token_type: string }> {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });
      if (!res.ok) {
        let errorDetail = `Login failed (${res.status})`;
        try {
          const err = await res.json();
          errorDetail = err.detail || errorDetail;
        } catch (e) {
          // response body was not valid JSON
        }
        throw new Error(errorDetail);
      }
      return res.json();
    },
    async signup(userData: any) {
      return fetchApi('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    },
    async googleLogin(profile: any) {
      return fetchApi('/auth/google-login', {
        method: 'POST',
        body: JSON.stringify(profile),
      });
    },
    async checkEmail(email: string): Promise<{ exists: boolean }> {
      return fetchApi(`/auth/check-email?email=${encodeURIComponent(email)}`);
    },
    async phoneLogin(phone: string, otp: string): Promise<{ access_token: string; token_type: string }> {
      return fetchApi('/auth/phone-login', {
        method: 'POST',
        body: JSON.stringify({ phone, otp }),
      });
    },
    async requestOtp(phone: string): Promise<{ message: string; otp: string }> {
      return fetchApi('/auth/request-otp', {
        method: 'POST',
        body: JSON.stringify({ phone }),
      });
    },
    async getMe() {
      return fetchApi('/auth/me');
    }
  },

  // Listings API
  listings: {
    async getAll(params: { type?: string; category?: string; search?: string; lat?: number; lon?: number; radius?: number; is_emergency?: boolean } = {}) {
      const query = new URLSearchParams();
      if (params.type) query.append('type', params.type);
      if (params.category) query.append('category', params.category);
      if (params.search) query.append('search', params.search);
      if (params.lat !== undefined) query.append('lat', params.lat.toString());
      if (params.lon !== undefined) query.append('lon', params.lon.toString());
      if (params.radius !== undefined) query.append('radius', params.radius.toString());
      if (params.is_emergency !== undefined) query.append('is_emergency', params.is_emergency.toString());

      return fetchApi(`/listings/?${query.toString()}`);
    },
    async getById(id: number) {
      return fetchApi(`/listings/${id}`);
    },
    async create(listingData: any) {
      return fetchApi('/listings/', {
        method: 'POST',
        body: JSON.stringify(listingData),
      });
    },
    async updateStatus(id: number, status: string) {
      return fetchApi(`/listings/${id}?status=${status}`, {
        method: 'PUT',
      });
    },
    async delete(id: number) {
      return fetchApi(`/listings/${id}`, {
        method: 'DELETE',
      });
    },
    async createBarterOffer(listingId: number, offerData: any) {
      return fetchApi(`/listings/${listingId}/barter-offers`, {
        method: 'POST',
        body: JSON.stringify(offerData),
      });
    },
    async getBarterOffers(listingId: number) {
      return fetchApi(`/listings/${listingId}/barter-offers`);
    },
    async updateBarterOfferStatus(offerId: number, status: string) {
      return fetchApi(`/listings/barter-offers/${offerId}/status?status=${status}`, {
        method: 'PUT',
      });
    }
  },

  // Chat API
  chats: {
    async getMyChats() {
      return fetchApi('/chats/');
    },
    async getOrCreate(recipientId: number, listingId?: number) {
      return fetchApi('/chats/', {
        method: 'POST',
        body: JSON.stringify({ recipient_id: recipientId, listing_id: listingId }),
      });
    },
    async getDetails(chatId: number) {
      return fetchApi(`/chats/${chatId}`);
    },
    async sendMessage(chatId: number, msgData: any) {
      return fetchApi(`/chats/${chatId}/messages`, {
        method: 'POST',
        body: JSON.stringify(msgData),
      });
    },
    getWebSocketUrl(chatId: number): string {
      const token = localStorage.getItem('token') || '';
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsHost = import.meta.env.VITE_WS_URL || (typeof window !== 'undefined' && window.location.port === '5173' ? 'localhost:8000' : window.location.host);
      return `${wsProtocol}//${wsHost}/api/v1/chats/ws/${chatId}?token=${encodeURIComponent(token)}`;
    }
  },

  // Profile API
  profiles: {
    async getById(userId: number) {
      return fetchApi(`/profiles/${userId}`);
    },
    async updateMe(profileData: any) {
      return fetchApi('/profiles/me', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
    },
    async getListings(userId: number) {
      return fetchApi(`/profiles/${userId}/listings`);
    },
    async getReviews(userId: number) {
      return fetchApi(`/profiles/${userId}/reviews`);
    },
    async submitReview(userId: number, listingId: number, reviewData: any) {
      return fetchApi(`/profiles/${userId}/reviews?listing_id=${listingId}`, {
        method: 'POST',
        body: JSON.stringify(reviewData),
      });
    }
  },

  // AI API
  ai: {
    async classify(title: string) {
      return fetchApi(`/ai/classify?title=${encodeURIComponent(title)}`);
    },
    async generateDescription(title: string, condition: string, type: string) {
      return fetchApi(`/ai/generate-description?title=${encodeURIComponent(title)}&condition=${encodeURIComponent(condition)}&type=${encodeURIComponent(type)}`);
    },
    async checkFairness(item1Title: string, item1Cond: string, item2Title: string, item2Cond: string) {
      return fetchApi(`/ai/barter-fairness?item1_title=${encodeURIComponent(item1Title)}&item1_cond=${encodeURIComponent(item1Cond)}&item2_title=${encodeURIComponent(item2Title)}&item2_cond=${encodeURIComponent(item2Cond)}`);
    },
    async getAlternatives(query: string) {
      return fetchApi(`/ai/alternatives?query=${encodeURIComponent(query)}`);
    },
    async chatbot(message: string, history: any[] = []) {
      return fetchApi('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message, history }),
      });
    },
    async getRecommendations() {
      return fetchApi('/ai/recommendations');
    },
    async parseSearch(query: string) {
      return fetchApi(`/ai/parse-search?query=${encodeURIComponent(query)}`);
    },
    async checkSpam(description: string) {
      const descParam = encodeURIComponent(description);
      return fetchApi(`/ai/spam-check?description=${descParam}`, {
        method: 'POST',
      });
    }
  },

  // Communities API
  communities: {
    async getAll(params: { category?: string; search?: string } = {}) {
      const query = new URLSearchParams();
      if (params.category) query.append('category', params.category);
      if (params.search) query.append('search', params.search);
      return fetchApi(`/communities/?${query.toString()}`);
    },
    async getById(id: number) {
      return fetchApi(`/communities/${id}`);
    },
    async create(communityData: any) {
      return fetchApi('/communities/', {
        method: 'POST',
        body: JSON.stringify(communityData),
      });
    },
    async join(id: number) {
      return fetchApi(`/communities/${id}/join`, { method: 'POST' });
    },
    async leave(id: number) {
      return fetchApi(`/communities/${id}/leave`, { method: 'POST' });
    },
    async getMembers(id: number) {
      return fetchApi(`/communities/${id}/members`);
    },
    async getChannels(id: number) {
      return fetchApi(`/communities/${id}/channels`);
    },
    async createChannel(id: number, channelData: any) {
      return fetchApi(`/communities/${id}/channels`, {
        method: 'POST',
        body: JSON.stringify(channelData),
      });
    },
    async getChannelMessages(channelId: number) {
      return fetchApi(`/communities/channels/${channelId}/messages`);
    },
    async sendChannelMessage(channelId: number, content: string, imageUrl?: string, videoUrl?: string) {
      return fetchApi(`/communities/channels/${channelId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content, image_url: imageUrl, video_url: videoUrl }),
      });
    },
    async getPolls(id: number) {
      return fetchApi(`/communities/${id}/polls`);
    },
    async createPoll(id: number, pollData: any) {
      return fetchApi(`/communities/${id}/polls`, {
        method: 'POST',
        body: JSON.stringify(pollData),
      });
    },
    async votePoll(pollId: number, optionIndex: number) {
      return fetchApi(`/communities/polls/${pollId}/vote?option_index=${optionIndex}`, {
        method: 'PUT',
      });
    }
  },

  // Events API
  events: {
    async getAll(params: { community_id?: number; lat?: number; lon?: number; radius?: number } = {}) {
      const query = new URLSearchParams();
      if (params.community_id !== undefined) query.append('community_id', params.community_id.toString());
      if (params.lat !== undefined) query.append('lat', params.lat.toString());
      if (params.lon !== undefined) query.append('lon', params.lon.toString());
      if (params.radius !== undefined) query.append('radius', params.radius.toString());
      return fetchApi(`/events/?${query.toString()}`);
    },
    async create(eventData: any) {
      return fetchApi('/events/', {
        method: 'POST',
        body: JSON.stringify(eventData),
      });
    },
    async rsvp(eventId: number, status: string) {
      return fetchApi(`/events/${eventId}/rsvp`, {
        method: 'POST',
        body: JSON.stringify({ status }),
      });
    },
    async getWeather(lat: number, lon: number) {
      return fetchApi(`/events/weather?lat=${lat}&lon=${lon}`);
    }
  },

  // Admin API
  admin: {
    async getStats() {
      return fetchApi('/admin/stats');
    },
    async getUsers() {
      return fetchApi('/admin/users');
    },
    async verifyUser(userId: number) {
      return fetchApi(`/admin/verify-identity/${userId}`, {
        method: 'POST',
      });
    },
    async deleteListing(listingId: number) {
      return fetchApi(`/admin/listings/${listingId}`, {
        method: 'DELETE',
      });
    }
  },

  // Notifications API
  notifications: {
    async getAll() {
      return fetchApi('/notifications/');
    },
    async markAsRead(id: number) {
      return fetchApi(`/notifications/${id}/read`, {
        method: 'PUT',
      });
    },
    async markAllAsRead() {
      return fetchApi('/notifications/read-all', {
        method: 'PUT',
      });
    }
  },

  // Upload API
  upload: {
    async uploadImage(file: File): Promise<{ url: string }> {
      const formData = new FormData();
      formData.append('file', file);
      
      return fetchApi('/upload/file', {
        method: 'POST',
        body: formData,
      });
    }
  }
};
