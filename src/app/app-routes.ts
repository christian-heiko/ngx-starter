import {Routes} from '@angular/router';
import {DemoPanelComponent} from './demo-panel/demo-panel.component';
import {CardsDemoComponent} from './cards-demo/cards-demo.component';
import {DemoPanelSideComponent} from './demo-panel-side/demo-panel-side.component';
import {TableDemoComponent} from './table-demo/table-demo.component';
import {EatableCategoryListComponent} from './eatables/categories/category-list/eatable-category-list.component';
import {EatableCategoryDetailComponent} from './eatables/categories/category-detail/eatable-category-detail.component';


export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'app/mixed-demo',
    pathMatch: 'full'
  },

  {
    path: 'app',
    children: [



      {
        path: 'mixed-demo',
        component: DemoPanelComponent,
        data: {
          title: 'Mixed Demo'
        }
      },

      {
          path: 'eatables',
          component: EatableCategoryListComponent,
          data: {
              title: 'Eatables'
          }
      },
      {
          path: 'eatables/:id',
          component: EatableCategoryDetailComponent,
          data: {
              title: 'Eatable Detail'
          }
      },

      {
        path: 'sub',
        children: [
          {
            path: 'override-title',
            component: DemoPanelComponent,
            data: {
              title: 'Overridden Title'
            }
          },
          {
            path: 'toolbar-title-demo',
            component: DemoPanelComponent,
          }
        ],
        data: {
          _title: 'Base Title'
        }
      } ,
    ],
    data: {
      title: 'App Home'
    }
  },

    // OUTLET SIDE

    {
        path: 'mixed-demo',
        outlet: 'side',
        component: DemoPanelSideComponent,

    },
];
