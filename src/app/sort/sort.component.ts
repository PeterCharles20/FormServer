import {Component, OnInit, Provider} from '@angular/core';
import {TabView} from '../TabView';
import {Survey} from '../Survey';
import {Assessment} from '../Assessment';
import {Choice} from '../Choice';
import {HttpClient} from '@angular/common/http';
// import {ActivatedRoute} from '@angular/router';
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

  constructor(
      private http: HttpClient,
      private route: ActivatedRoute,
      private formService: SurveyService
  ) { }

  ngOnInit() {
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
                data => this.tabViews = data, // Move data into TabView
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
        this.createSurvey(); // init survey

        let tempAssessment: Assessment; // Create a temporary
        let i = 0; // Iterates through the tab view
        let j = 0; // Iterates through the assessment choices

        this.tabTitle = this.tabViews[0].tabViewLabel;

        for (i; i < this.tabViews.length; i++) {
            tempAssessment = this.createAssessment(i); // Create a new assessment
            if (this.tabViews[i].assessmentType.toString() === '4') {
                tempAssessment.addChoice(this.createChoice(i, 4)); // Add a single choice to an assessment
            } else if (this.tabViews[i].assessmentType.toString() === '5') {
                j = i; // index of the choice
                while (this.tabViews[j].assessmentId === this.tabViews[i].assessmentId) {
                    tempAssessment.addChoice(this.createChoice(j, 5)); // Add a single a choice to an assessment
                    j++;
                }
                i = j; // Update new position of i
            }
            console.log(tempAssessment);
            this.survey.addAssessment(tempAssessment); // Add the assessment to the survey
        }
    }

    /**
     * Creates a new choice based on the assessment type
     * @param i
     * Index of the array
     * @type
     * The assessment type
     */
    public createChoice(i: number, type: number): Choice {
        let tempChoices: Choice; // Create temp choice
        /** Creates a default choice*/
        if (type === 4) {
            tempChoices = new Choice(
                4,
                'Type 4'
            );
            return tempChoices;
        } else {
            /** Creates a normal choice*/
            tempChoices = new Choice(
                this.tabViews[i].choiceId,
                this.tabViews[i].choiceLabel
            );
        }
        return tempChoices;
    }

    /**
     * Creates a new survey
     */
    public createSurvey(): void {
        this.survey = new Survey(
            this.tabViews[0].tabViewId,
            this.tabViews[0].tabViewLabel
        );
    }
    /**
     * Init temp assessment
     * @param i
     * Index of the array
     */
    public createAssessment(i: number): Assessment {
        const tempAssessment = new Assessment(
            this.tabViews[i].assessmentId,
            this.tabViews[i].assessmentType,
            this.tabViews[i].assessmentLabel.trim()
        );
        return tempAssessment;
    }

}
