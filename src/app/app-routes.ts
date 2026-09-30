import { Routes } from '@angular/router';
import {routes as PdfDemoRoutes} from './pdf-editor-demo/pdf-editor-route';
import {routes as SearchFormRoutes} from './search-form/search-route';
import {routes as AllPdfRoutes} from"./all-pdf-table/all-pdf-route";

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    {
        path:'pdf-demo',
        children: PdfDemoRoutes
    },
    {
        path:'home',
        children: SearchFormRoutes
    },
    {
        path:'all',
        children: AllPdfRoutes
    }
    
];
