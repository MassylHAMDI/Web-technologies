
export class Game {
    constructor(data) {
        this.data = data;
    }
    levels() {
        return this.data.levels;
    }

    level(id) {
        if (id < 0 || id > this.data.levels.length) {
            throw new Error("Niveau non trouvé");
        }
        try {
            for (let i = 0; i < this.data.levels.length; i++) {
                if (this.data.levels[i].id == id) {
                    return this.data.levels[i];
                }
            }
        } catch (error) {
            console.log(error.message);
        }
        }

    word(id) {
        if (this.data.words[id] == undefined) {
            throw new Error("Mot non trouvé");
        }
        try {   
            return this.data.words[id];
        } catch (error) {
            console.log(error.message);
        }
    }

    stringToArray(string) {
        /*let array = [];
        string = string.toUpperCase();
        for (let i = 0; i < string.length; i++) {
            array.push(string[i]);
        }
        console.log(array);
        return array; */
        return string.toUpperCase().split('');

    }

    letters(id) {
        return this.stringToArray(this.word(id)).sort();
    }

    computeLine(id, playedWord) {
        let playedWordArray = this.stringToArray(playedWord);
        let wordArray = this.stringToArray(this.word(id));
        let line = [];

        for (let i = 0; i < wordArray.length ; i++) {
            if (playedWordArray[i] == wordArray[i]) {
                line.push({letter: playedWordArray[i], state: true});
            }
            else if (playedWordArray[i] != wordArray[i]) {
                line.push({letter: (playedWordArray[i] != undefined ? playedWordArray[i] : '_'), state: false});
            }
        }
        return line;

    }



}
