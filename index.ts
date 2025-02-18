import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import MentionControl from './MentionControl';


export class MentionsControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private _container: HTMLDivElement;
    private _context: ComponentFramework.Context<IInputs>;
    private varInput: string[];
    private varSuggetionInput:string[];
    private varHintText: string[];
    private varText: string;
    private _outputText: string = '';
    private notifyOutputChanged: () => void;
    private Customheight: number;
    private CustomBgColor:string;
    private resetTextarea: string;

    constructor() { }

    private updateInputData(): void {
        if (typeof this._context.parameters.Mentions.raw === 'string') {
            this.varInput = this._context.parameters.Mentions.raw.split(',').map(item => item.trim());
        } else {
            this.varInput = [];
        }
    }

    private UpdateSuggetionInput(): void {
        if (typeof this._context.parameters.Suggetions.raw === 'string') {
            this.varSuggetionInput = this._context.parameters.Suggetions.raw.split(',').map(item => item.trim());
        } else {
            this.varSuggetionInput = [];
        }
    }

    private updateHeightInput(): void {
        const heightInput = this._context.parameters.CustomHeight;
        if (heightInput !== undefined && heightInput.raw !== null) {
            this.Customheight = parseInt(heightInput.raw, 10);
        }
    }

    private updateHintText(): void {
        this.varHintText = [this._context.parameters.HintText.raw || ''];
    }

    private updateTextInput(): void {
        const textInput = this._context.parameters.DefaultText;
        if (typeof textInput.raw === 'string') {
            this.varText = textInput.raw;
        } else {
            this.varText = '';

        }
    }
    
    private UpdateBgColor(): void {
        const bgColorInput = this._context.parameters.BackgroundColor;
        if (typeof bgColorInput.raw === 'string') {
            this.CustomBgColor = bgColorInput.raw;
        } else {
            this.CustomBgColor = ''; 
        }
    }
    
    private updateResetTextarea(): void {
        const resetTextareaProp = this._context.parameters.ResetTextarea;
        if (resetTextareaProp && resetTextareaProp.raw === 'true') {
            // Reset the textarea
            const textareaElement = document.querySelector('.mention-input') as HTMLTextAreaElement;
            if (textareaElement) {
                textareaElement.value = ''; // Clear the textarea
            }
    
            // Reset the output text
            this._outputText = ''; // Clear the output text
    
            // Notify about the change
            this.notifyOutputChanged();
        }
    }
    
    
    

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        this._context = context;
        this._container = container;
        this.notifyOutputChanged = notifyOutputChanged;
        
        // Initialize inputs
        this.updateInputData();
        this.updateHeightInput();
        this.updateHintText();
        this.updateTextInput();
        this.UpdateBgColor();
        this.UpdateSuggetionInput();
        this.updateResetTextarea();
       
        this.renderControl();
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this._context = context;

        // Update inputs
        this.updateInputData();
        this.updateHeightInput();
        this.updateHintText();
        this.updateTextInput();
        this.UpdateBgColor();
        this.UpdateSuggetionInput();
        this.updateResetTextarea();

        this.renderControl();
    }

    private renderControl(): void {
        const onInputChange = (value: string) => {
            this._outputText = value;
            this.notifyOutputChanged();
        }; 

        const hinttext = this.varHintText.join(', ');

        const mentionControl = React.createElement(MentionControl, {
            users:this.varInput,
            onInputChange: onInputChange,
            Customheight: this.Customheight,
            hinttext: hinttext,
            text: this.varText,
            bgcolor:this.CustomBgColor,
            specificUserInput: this.varSuggetionInput.join(','),
            resetTextarea:this.resetTextarea
        });

        ReactDOM.render(mentionControl, this._container);
    }

    public getOutputs(): IOutputs {
        return {
            OutputText: this._outputText
        };
    }

    public destroy(): void {
        ReactDOM.unmountComponentAtNode(this._container);
    }
}
