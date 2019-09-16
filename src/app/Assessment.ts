import {Choice} from './Choice';

/**
 * Used to store the mosaiq assessments that have been received from drupal
 * Assessments are defined by their id, type, description, and an array of choices
 * This format has been defined within Drupal, so that once Survey has been converted into a JSON string
 * It can match the data in Drupal
 */
export class Assessment {
    /**
     * The ID of an assessment
     * Used to identify with assessment ID stored in drupa
     */
    id: number;
    /**
     * Stores the assessment type
     */
    asessmentType: number;
    /**
     * Stores the description of an assessment
     */
    assessmentDesc: string;
    /**
     * Stores an array of choices
     * These choices are the options of an assessment
     */
    choices: Choice[];

    /**
     * Constructor for Assessment Class
     * @param id
     * The Assessment ID
     * @param assessmentType
     * The Assessment Type
     * @param assessmentDesc
     * The description of an Assessment
     */
    constructor(id: number, assessmentType: number, assessmentDesc: string, choices: Choice[]) {
        this.id = id;
        this.asessmentType = assessmentType;
        this.assessmentDesc = assessmentDesc;
        this.choices = choices;
    }
}
