import * as React from 'react';
import './MentionControl.css';

interface MentionControlProps {
    users: string[];
    specificUserInput: string;
    onInputChange: (value: string) => void;
    Customheight: number;
    hinttext: string;
    text: string;
    bgcolor: string;
    resetTextarea: string; // Add resetTextarea prop
}

interface MentionControlState {
    inputValue: string;
    showSuggestions: boolean;
    showExtraSuggestion: boolean;
    cursorPosition: number;
    bgcolor: string;
    resetTextarea: string; // Add resetTextarea to state
}

class MentionControl extends React.Component<MentionControlProps, MentionControlState> {
    private suggestionsRef: HTMLUListElement | null = null;
    constructor(props: MentionControlProps) {
        super(props);
        this.state = {
            inputValue: '',
            showSuggestions: false,
            cursorPosition: 0,
            bgcolor: this.props.bgcolor,
            showExtraSuggestion: false,
            resetTextarea: this.props.resetTextarea
        };
    }

    handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.target.value;
        this.setState({
            inputValue: value,
            showSuggestions: value.endsWith('@'),
            cursorPosition: event.target.selectionStart,
            bgcolor: this.props.bgcolor,
            showExtraSuggestion: false
        });
        this.props.onInputChange(value);
    };

    componentDidUpdate(prevProps: MentionControlProps) {
        if (prevProps.resetTextarea !== this.props.resetTextarea && this.props.resetTextarea === 'true') {
            // Clear the textarea
            this.setState({ inputValue: '' });
        }
    }

    handleSuggestionClick = (user: string) => {
        const { inputValue, cursorPosition } = this.state;
        const updatedValue = inputValue.slice(0, cursorPosition) + user + inputValue.slice(cursorPosition);
        this.setState({
            inputValue: updatedValue,
            showSuggestions: false,
            cursorPosition: cursorPosition + user.length,
            showExtraSuggestion: false
        });
        this.props.onInputChange(updatedValue);
    };

    handleStaticUserClick = (user: string) => {
        if (["Organizer", "Salesperson", "Playbook", "Customer"].includes(user)) {
            this.setState({ showExtraSuggestion: true });
            this.props.onInputChange('@' + user);
        } else {
            const updatedValue = this.state.inputValue.slice(0, this.state.cursorPosition) + user + this.state.inputValue.slice(this.state.cursorPosition);
            this.setState({
                inputValue: updatedValue,
                showSuggestions: false,
                cursorPosition: this.state.cursorPosition + user.length,
                showExtraSuggestion: false
            });
            this.props.onInputChange(updatedValue);
        }
    };

    calculateSuggestionPosition = () => {
        const { inputValue, cursorPosition } = this.state;
        const lineHeight = 25;
        const inputLines = inputValue.substr(0, cursorPosition).split('\n');
        const linesAboveCursor = inputLines.length - 1;
        const lastLineLength = inputLines[inputLines.length - 1].length;
        const lastLinePosition = (lastLineLength * 7) + 10;

        const totalHeight = (linesAboveCursor * lineHeight) + (cursorPosition === inputValue.length ? lineHeight : 0);

        const remainingWidth = 100 - (lastLineLength % 100);
        const left = cursorPosition === lastLinePosition - 20 ? remainingWidth : 0;

        return { top: `${totalHeight}px`, left: `${left}px` };
    };

    render() {
        const { inputValue, showSuggestions, bgcolor, showExtraSuggestion } = this.state;
        const { users, specificUserInput, Customheight, hinttext } = this.props;
        const suggestionPosition = this.calculateSuggestionPosition();


        return (
            <div className="mention-control" style={{ position: 'relative' }}>
                <textarea
                    className="mention-input"
                    style={{ height: Customheight, backgroundColor: bgcolor }}
                    value={inputValue}
                    onChange={this.handleInputChange}
                    placeholder={hinttext}
                />
                {showSuggestions && showExtraSuggestion && (
                    <ul
                        className="mention-suggestions"
                        style={{
                            position: 'absolute',
                            top: suggestionPosition.top,
                            left: suggestionPosition.left,
                            zIndex: 1,
                            backgroundColor: '#f0f0f0',
                            minWidth: '225px',
                            maxWidth: '400px'
                        }} >
                        {specificUserInput && specificUserInput.split(',').map((user, index) => (
                            <li key={index} onClick={() => this.handleSuggestionClick(user)} style={{ alignItems: 'center', paddingTop: '5px', height: '30px', paddingLeft: '5px' }}>
                                {user}
                            </li>
                        ))}
                    </ul>
                )}
                {!showExtraSuggestion && showSuggestions && (
                    <ul
                        className="mention-suggestions"
                        style={{
                            position: 'absolute',
                            top: suggestionPosition.top,
                            left: suggestionPosition.left,
                            zIndex: 1,
                            backgroundColor: '#f0f0f0',
                            minWidth: '225px',
                            maxWidth: '400px'
                        }} >
                        {users.map((user, index) => (
                            <li key={index} onClick={() => this.handleStaticUserClick(user)} style={{ alignItems: 'center', paddingTop: '5px', height: '30px', paddingLeft: '5px' }}>
                                <div>{user}</div>
                                {index !== users.length - 1 && <br />}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }
}

export default MentionControl;
