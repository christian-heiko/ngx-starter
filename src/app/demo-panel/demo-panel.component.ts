import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IFileUploadClient, FileUploadClient, CommonDialogService} from '@elderbyte/ngx-starter';
import {SuggestionProvider} from '../../../projects/elderbyte/ngx-starter/src/lib/common/suggestion-provider';
import {of} from 'rxjs';

@Component({
  selector: 'starter-demo-demo-panel',
  templateUrl: './demo-panel.component.html',
  styleUrls: ['./demo-panel.component.scss']
})
export class DemoPanelComponent implements OnInit {

  public expanded: boolean;
  public uploadClient: IFileUploadClient;

  public myLabels = ['hello', 'world'];
  public mySuggestions = ['Apple', 'Babbple', 'Here', 'there'];
  public labelSuggestions = SuggestionProvider.build(
    (filter) => of(
      this.mySuggestions.filter(s => !filter || s.toLocaleLowerCase().includes(filter.toLocaleLowerCase()))
    )
  );

  constructor(
    private http: HttpClient,
    private dialogService: CommonDialogService
  ) {
    this.uploadClient = new FileUploadClient(http, '/woot', 'POST');
  }

  ngOnInit() {
  }


  public openYesNo(event: any): void {
    this.dialogService.showConfirm({
        title: 'Simple yes or no question',
        message: 'Are you ok?',
        yesNo: true,
        config: {
          autoFocus: false
        }
    }).subscribe();
  }

}
