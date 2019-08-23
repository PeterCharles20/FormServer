import {Component, Input, NgModule, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AppComponent} from '../app.component';
import {
    CheckboxField, CustomField, DateField, DateRangeField,
    DynamicField,
    MeasureField, MultilineField,
    NestedFormGroup,
    NgXformEditSaveComponent,
    NgXformModule, NumberField, RadioGroupField,
    SelectField,
    TextField
} from '@esss/ng-xform';
import {Observable, of, Subject, Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Title} from '@angular/platform-browser';
import {Validators} from '@angular/forms';
import {TabView} from '../TabView';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {Survey} from '../Survey';
import {SurveyService} from '../_services/survey.service';
import {Assessment} from '../Assessment';
import {Choice} from '../Choice';
import {delay} from 'rxjs/operators';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})

@NgModule({
  declarations: [AppComponent] ,
    imports: [NgXformModule, RouterModule],
  bootstrap: [AppComponent]
})
export class FormComponent implements OnInit, OnDestroy {

  @ViewChild(NgXformEditSaveComponent) xformComponent: NgXformEditSaveComponent;
  @ViewChild('customField') customFieldTmpl: TemplateRef<any>;

    @Input() survey: Survey;
    @Input() tabTitle: string;


  public onchangefn = new Subject<string>();

  public fields: DynamicField[];
  public horizontal = false;
  public labelWidth = 2;
  public model: any;
  public outputhelper = {A: 1, B: 2, C: 3};
  public subscriptions: Subscription[] = [];

  constructor(
        private titleService: Title,
        private http: HttpClient
  )
  {}

  ngOnInit() {
    const minDate = new Date();
    const maxDate = new Date();

    this.subscriptions.push(this.onchangefn.asObservable().subscribe(
      (value: any) => this.xformComponent.setValue({outputopt: this.outputhelper[value]})
    ));

    minDate.setDate(minDate.getDate() - 3);
    maxDate.setDate(maxDate.getDate() + 3);
    this.titleService.setTitle(this.tabTitle);

    this.initField();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * This function is used to init the fields array.
   * The fields will be used to display the different type of questions
   */
  public initField(): void {

      this.fields = [
          new TextField({
              key: 'first_name',
              label: 'First Name',
          }),
          new TextField({
              key: 'last_name',
              label: 'Last Name',
          }),
          new TextField({
              key: 'mrn',
              label: 'Medical Record Number (MRN)',
          })
      ];

      let i = 0;
      for (i; i < this.survey.assessments.length; i++) {
          if (this.survey.assessments[i].asessmentType.toString() === '5') {
              this.createRadioGroup(i);
              this.createSelect(i);
          } else {
              this.createText(i);
          }
      }
  }

    /**
     * This funtion is used to create a SelectField
     * @param i Is used to determine which assessment has been inputed
     */
    public createSelect(i: number) {

        // Push new select into the fields array
        const tempField = new SelectField({
            key: this.survey.assessments[i].id.toString(),
            label: this.survey.assessments[i].assessmentDesc,
            searchable: true,
            options: this.survey.assessments[i].choices,
            addNewOption: true,
            addNewOptionText: 'id',
            optionLabelKey: 'choiceDesc',
            validators: [
                Validators.required,
                Validators.minLength(1)
            ]
        });

        // Push
        this.fields.push(tempField);
    }

    /**
     * This funtion is used to create a SelectField
     * @param i Is used to determine which assessment has been inputed
     */
    public createSelectMany(i: number) {

        // Push new select into the fields array
        const tempField = new SelectField({
            key: this.survey.assessments[i].id.toString(),
            label: this.survey.assessments[i].assessmentDesc,
            searchable: true,
            options: this.survey.assessments[i].choices,
            addNewOption: true,
            addNewOptionText: 'id',
            optionLabelKey: 'choiceDesc',
            multiple: true,
            validators: [
                Validators.required,
                Validators.minLength(1)
            ]
        });

        // Push
        this.fields.push(tempField);
    }

    /**
     * This funtion is used to create a RadioGroup
     * @param i Is used to determine which assessment has been inputed
     */
    public createRadioGroup(i: number) {

        // Push new radio group into the fields array
        const tempField = new RadioGroupField({
            key: this.survey.assessments[i].id.toString(),
            label: this.survey.assessments[i].assessmentDesc,
            options: of(this.survey.assessments[i].choices).pipe(delay(10)),
            optionValueKey: 'id',
            optionLabelKey: 'choiceDesc',
            validators: [
                Validators.required
            ]
        });

        // Push
        this.fields.push(tempField);
    }

    /**
     * Used to create a TextField
     * @param i Is used to determine which assessment has been inputed
     */
    public createText(i: number) {

        // Push new text field into the fields array
        const tempField = new TextField({
            key: this.survey.assessments[i].id,
            label: this.survey.assessments[i].assessmentDesc,
            validators: [
                Validators.required,
                Validators.minLength(1)
            ]
        });

        // Push
        this.fields.push(tempField);

    }

    /**
     * Used to create a NumberField
     * @param i Is used to determine which assessment has been inputed
     */
    public createNumber(i: number): void {

        // Push new number field into the fields array
        const tempField = new NumberField({
            key: this.survey.assessments[i].id,
            label: this.survey.assessments[i].assessmentDesc + ' (Number)',
            validators: [
                Validators.required,
                Validators.minLength(1)
            ]
        });

        // Push
        this.fields.push(tempField);

    }

    /**
     * Used to create a TextField
     * @param i Is used to determine which assessment has been inputed
     */
    public createCheckBox(i: number) {

        // Push new text field into the fields array
        const tempField = new CheckboxField({
            key: this.survey.assessments[i].id,
            label: this.survey.assessments[i].assessmentDesc,
        });

        // Push
        this.fields.push(tempField);
    }

  public onSubmit(values: object) {
    this.model = values;
    console.log(this.model);
  }
}
