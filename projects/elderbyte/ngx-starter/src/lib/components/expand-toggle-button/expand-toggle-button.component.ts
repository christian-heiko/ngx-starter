
import {Component, Input, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs/index';


@Component({
  selector: 'expand-toggle-button',
  templateUrl: './expand-toggle-button.component.html'
})
export class ExpandToggleButtonComponent implements OnInit {

  private _isExpanded: boolean;
  private _expandedChanged = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {

  }

  @Output('changed')
  public get expandedChanged(): Observable<boolean> {
    return this._expandedChanged;
  }

  public get isExpanded(): boolean {
    return this._isExpanded;
  }

  @Input('expanded')
  public set isExpanded(value: boolean) {
    this._isExpanded = value;
    this._expandedChanged.next(value);
  }

  public onToggleExpand(event: any) {
    this.isExpanded = !this.isExpanded;
  }
}