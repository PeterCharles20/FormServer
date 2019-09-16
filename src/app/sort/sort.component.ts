import {Component, OnInit, Provider} from '@angular/core';
import {TabView} from '../TabView';
import {Survey} from '../Survey';
import {Assessment} from '../Assessment';
import {Choice} from '../Choice';
import {HttpClient} from '@angular/common/http';
import {SurveyService} from '../_services/survey.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.css'],
})
export class SortComponent implements OnInit {

    /**
     * The id from the URL is linked to the entity ID of the tabview
     */
    private id = +this.route.snapshot.paramMap.get('id');
    /**
     * Stores an array of TabViews that have been imported from Drupal
     */
    private tabViews: TabView [];
    /**
     * An instance of a Survey
     */
    private survey: Survey;

    private tabTitle: string;

    surveyS;

  constructor(
      private http: HttpClient,
      private route: ActivatedRoute,
      private formService: SurveyService
  ) { }

  ngOnInit() {
    // this.createSurvey(); // Create an instance of a survey
    console.log(this.id);
    this.getTabView();
  }

    /**
     * GET tab views
     * Async task that uses the service class to interface with Drupal
     * Retrieved data from drupal is then stored into an array of TabViews
     * Once completed, the TabViews are then sorted into the Survey Class
     */
    public getTabView() {
        this.formService.getTabView(this.id)
            .subscribe(
                data => this.surveyS = data, // Move data into TabView
                err => console.log(err), // Log any Errors
                () => this.sortSurvey()); // Sort tabviews into a Survey
    }

    /**
     * Sorts out the tabviews that were retrieved from Drupal
     * Creates assessments and their choices by iterating through the tabviews
     * Once an assessment is created and it's choices have been populated
     * Then it is added into the Survey
     */
    public sortSurvey(): void {
        let json = JSON.stringify(eval("(" + this.surveyS + ")"));

        this.survey = JSON.parse(json);
        this.tabTitle = this.survey.tabDesc;

    }

}
