import { Injectable, signal } from '@angular/core';
import { Supabase } from './supabase';
import { Router } from '@angular/router';
import { User } from '@supabase/supabase-js';
import { Profile, UserRole } from '../models/profile.model';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  user = signal<User | null>(null);
  profile = signal<Profile | null>(null);
  loading = signal<boolean>(true);

  constructor(
    private supabaseService: Supabase,
    private router: Router
  ) {
    this.initAuth();
  }

  private async initAuth() {
    const { data } = await this.supabaseService.client.auth.getSession();

    this.user.set(data.session?.user ?? null);

    if (data.session?.user) {
      await this.loadProfile();
    }

    this.supabaseService.client.auth.onAuthStateChange(async (_event, session) => {
      this.user.set(session?.user ?? null);

      if (session?.user) {
        await this.loadProfile();
      } else {
        this.profile.set(null);
      }
    });

    this.loading.set(false);
  }

  async loadProfile() {
    const user = this.user();

    if (!user) return;

    const { data } = await this.supabaseService.client
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    this.profile.set(data as Profile);
  }

  async signUp(
    email: string,
    password: string,
    fullName: string,
    role: UserRole
  ) {
    const { data, error } = await this.supabaseService.client.auth.signUp({
      email,
      password,
    });

    if (error) return { error };

    if (data.user) {
      const { error: profileError } = await this.supabaseService.client
        .from('profiles')
        .insert({
          id: data.user.id,
          full_name: fullName,
          role,
        });

      if (profileError) return { error: profileError };
    }

    return { error: null };
  }

  async signIn(email: string, password: string) {
    const { error } = await this.supabaseService.client.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      await this.loadProfile();
    }

    return { error };
  }

  async signOut() {
    await this.supabaseService.client.auth.signOut();
    this.user.set(null);
    this.profile.set(null);
    this.router.navigate(['/']);
  }

  isLoggedIn() {
    return !!this.user();
  }

  isHost() {
    return this.profile()?.role === 'host';
  }

  isClient() {
    return this.profile()?.role === 'client';
  }
}
