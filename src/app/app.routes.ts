import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { PropertyDetail } from './pages/property-detail/property-detail';
import { Dashboard } from './pages/dashboard/dashboard';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'property/:id', component: PropertyDetail },
    { path: 'dashboard', component: Dashboard },
];
