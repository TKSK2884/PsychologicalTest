export interface JsonData {
    settings: {
        question_type: number;
        parameters: string[];
    };
    questions: Question[];
}

export interface Question {
    title: string;
    selection: Selection[];
}

interface Selection {
    title: string;
    params?: SelectionParams;
}
interface SelectionParams {
    decision_making?: number;
    adaptability?: number;
    self_motivation?: number;
    stress_management?: number;
    emotional_intelligence?: number;
    interpersonal_skills?: number;
}

export interface ResultObject {
    select_test: string;
    content: string;
    time_date: Date;
}
