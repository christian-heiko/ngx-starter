import { Component, OnInit } from '@angular/core';
import { IDataContext, DataContextBuilder } from '@elderbyte/ngx-starter';

class Food {
  constructor(
    public name: string,
    public price: number
  ) { }
}


class FoodProperty {
    constructor(
        public name: string,
        public displayName: string
    ) { }
}


@Component({
  selector: 'starter-demo-table-demo',
  templateUrl: './table-demo.component.html',
  styleUrls: ['./table-demo.component.scss']
})
export class TableDemoComponent implements OnInit {

  public data: IDataContext<Food>;
  public dynamicProperties: FoodProperty[] = [];

  constructor() { }

  public ngOnInit(): void {
    this.data = DataContextBuilder.start<Food>()
      .buildLocalActivePaged([
        new Food('Bread', 45.53),
        new Food('Apple', 86.53),
        new Food('Milk', 34),
        new Food('Meat', 42),
        new Food('Fish', 12),

        new Food('Bread 2', 45.53),
        new Food('Apple 2', 86.53),
        new Food('Milk 2', 34),
        new Food('Meat 2', 42),
        new Food('Fish 2', 12),

        new Food('Bread 3', 45.53),
        new Food('Apple 3', 86.53),
        new Food('Milk 3', 34),
        new Food('Meat 3', 42),
        new Food('Fish 3', 12)
      ]);

    this.data.start();
  }

  public onSelectionChange(selection: Food[]): void {
      console.log('selection changed:', selection);
  }

  public onItemClick(food: Food): void {
      console.log('item clicked:', food);
  }

  public toggleColumns(event: Event): void {
      if (this.dynamicProperties.length === 0) {
          this.dynamicProperties = [
              new FoodProperty('category', 'Category'),
              new FoodProperty('vegan', 'Vegan')
          ];
      } else {
          this.dynamicProperties = [];
      }

      console.log(this.dynamicProperties);
  }

}
