/* eslint-disable prettier/prettier */
import { useReducer } from "react";

interface FormField {
  id: string;
  type: "text" | "select" | "checkbox";
  required: boolean;
  pattern: RegExp[];
}

interface FormStructure {
  name: string;
  fields: FormField[];
}

interface FormFieldState {
    id: string;
    // validations
    isValidated: boolean;
    errors: {
        pattern: string;
        message: string;
    }[]
}

interface FormFieldAction {
    type: "form_validate" | "form_submit";
    payload: any
}

interface FormState {
    id: string;
    isValidated: boolean;
    isSubmitted?: boolean;
    fields: FormFieldState[];
}

function formReducer(state: FormState, action: FormFieldAction): FormState {
    switch(action.type) {
        case "form_validate":
            // TODO: Validate state.fields and return with errors.
            break;
        case "form_submit":
            break;
        default:
            break;
    }

    return {
        id: "",
        isValidated: true,
        fields: []
    };
}

export function useForm(formStructure: FormStructure) {
    const [state, dispatch] = useReducer<FormState, [FormFieldAction]>(formReducer, {
        id: formStructure.name,
        isValidated: false,
        isSubmitted: false,
        fields: formStructure.fields.map(field => ({
            id: field.id,
            isValidated: false,
            errors: []
        }))
    });

    function validateForm() {
        dispatch({
            type: "form_validate",
            payload: state.fields
        });
    }

    // TODO: Change call back type.
    function submitForm(callback: () => void) {
        validateForm();

        // TODO: check if no errors and call submit.
        dispatch({
            type: "form_submit",
            payload: state.isSubmitted
        });
        callback();
    }

    return [state, validateForm, submitForm];

}