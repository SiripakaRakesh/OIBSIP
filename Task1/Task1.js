class Calculator {
    constructor() {
        this.userEntry = document.getElementById('user-entry');
        this.output = document.getElementById('output');
        this.registerEventListeners();
    }

    updateDisplay(value) {
        this.userEntry.textContent += value;
    }

    clearDisplay() {
        this.userEntry.textContent = '';
        this.output.textContent = '';
    }

    deleteLastChar() {
        this.userEntry.textContent = this.userEntry.textContent.slice(0, -1);
        this.output.textContent = '';
    }

    evaluateExpression() {
        try {
            const sanitizedExpression = this.sanitizeExpression(this.userEntry.textContent);
            const result = eval(sanitizedExpression);
            this.output.textContent = result;
        } catch (error) {
            this.output.textContent = 'Error';
        }
    }

    sanitizeExpression(expression) {
        // Replace 'x' with '*', '÷' with '/', 'sqrt' with 'Math.sqrt', and remove 'ans'
        return expression
            .replace(/x/g, '*')
            .replace(/÷/g, '/')
            .replace(/√/g, 'Math.sqrt')
            .replace(/ans/g, '')
    }

    registerEventListeners() {
        document.querySelectorAll('[data-number], [data-operator]').forEach(item => {
            item.addEventListener('click', () => this.updateDisplay(item.textContent));
        });

        document.getElementById('equals').addEventListener('click', () => this.evaluateExpression());

        document.getElementById('AC').addEventListener('click', () => this.clearDisplay());

        document.getElementById('DEL').addEventListener('click', () => this.deleteLastChar());

        document.getElementById('open-bracket').addEventListener('click', () => this.updateDisplay('('));

        document.getElementById('closing-bracket').addEventListener('click', () => this.updateDisplay(')'));
    }
}

// Instantiate the Calculator class
const calculator = new Calculator();