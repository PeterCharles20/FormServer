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
/**
 * @author Peter Charles Sims
 */
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

    private str: any;

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
                data => this.str = data, // Move data into TabView
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
        const json = JSON.parse(this.str);
        eval(json);
        this.survey = json;
        this.tabTitle = this.survey.tabViewLabel;

    }

    public submitSurvey(payload: string) {

    }

}
