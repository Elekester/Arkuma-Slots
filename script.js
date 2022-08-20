class Arkuma {
	constructor(stage = 1, cards = [false, false, false], sets = 0, cc = 0, boss = 0) {
		this.stage = stage;
		this.cards = [cards[0], cards[1], cards[2]];
		this.sets = sets;
		this.cc = cc;
		this.terminal = false;
		this.boss = 0;
	}
	
	saveData = {
		statistics: [
			null,
			[0, 0, 0, 0, 0, 0, 0, 0], 
			[0, 0, 0, 0, 0, 0, 0, 0], 
			[0, 0, 0, 0, 0, 0, 0, 0], 
			[0, 0, 0, 0, 0, 0, 0, 0], 
			[0, 0, 0, 0, 0, 0, 0, 0], 
			[0, 0, 0, 0, 0, 0, 0, 0], 
			[0, 0, 0, 0, 0, 0, 0, 0], 
			[0, 0, 0, 0, 0, 0, 0, 0], 
			[0, 0, 0, 0, 0, 0, 0, 0], 
			[0, 0, 0, 0, 0, 0, 0, 0], 
			[0, 0, 0, 0, 0, 0, 0, 0], 
			[0, 0, 0, 0, 0, 0, 0, 0], 
			[0, 0, 0, 0, 0, 0, 0, 0], 
			[0, 0, 0, 0, 0, 0, 0, 0], 
			[0, 0, 0, 0, 0, 0, 0, 0], 
			[0, 0, 0, 0, 0, 0, 0, 0], 
			[0, 0, 0, 0, 0, 0, 0, 0], 
			[0, 0, 0, 0, 0, 0, 0, 0], 
			[0, 0, 0, 0, 0, 0, 0, 0], 
			[0, 0, 0, 0, 0, 0, 0, 0], 
			[0, 0, 0, 0, 0, 0, 0, 0], 
			[0, 0, 0, 0, 0, 0, 0, 0], 
			[0, 0, 0, 0, 0, 0, 0, 0], 
			[0, 0, 0, 0, 0, 0, 0, 0], 
			[0, 0, 0, 0, 0, 0, 0, 0], 
			[0, 0, 0, 0, 0, 0, 0, 0], 
			[0, 0, 0, 0, 0, 0, 0, 0], 
			[0, 0, 0, 0, 0, 0, 0, 0], 
			[0, 0, 0, 0, 0, 0, 0, 0], 
			[0, 0, 0, 0, 0, 0, 0, 0]
		]
	}
	
	resetSaveData() {
		localStorage.removeItem('saveData');
		document.location.reload();
	}
	
	copy() {
		return new this.constructor(this.stage, this.cards, this.sets, this.cc, this.boss);
	}
	
	display() {
		document.getElementById('avg').innerText = this.expectedcc() + ' cc';
		document.getElementById('cc').innerText = this.cc + ' cc';
		document.getElementById('stage').innerText = this.stage;
		document.getElementById('cards').innerText = (this.cards[0] ? 'B ' : '_ ') + (this.cards[1] ? 'P ' : '_ ') + (this.cards[2] ? 'Y' : '_');
		document.getElementById('sets').innerText = '+ ' + ((this.sets == 0) ? 100 : (this.sets == 1) ? 300 : 500) + ' cc';
		document.getElementById('boss').innerText = this.boss ? this.boss : false;
		
		if (this.terminal) {
			for (const input of document.getElementsByClassName('card')) {
				input.disabled = true;
			}
			for (const input of document.getElementsByClassName('bMult')) {
				input.disabled = true;
			}
			for (const input of document.getElementsByClassName('spinner')) {
				input.disabled = true;
			}
		} else if (this.boss) {
			for (const input of document.getElementsByClassName('card')) {
				input.disabled = true;
			}
			for (const input of document.getElementsByClassName('bMult')) {
				if (this.constructor.bMult[this.boss].includes(input.value.slice(0,-1)/100)) {
					input.disabled = false;
				} else {
					input.disabled = true;
				}
			}
			for (const input of document.getElementsByClassName('spinner')) {
				input.disabled = false;
			}
		} else {
			for (const input of document.getElementsByClassName('card')) {
				input.disabled = false;
			}
			for (const input of document.getElementsByClassName('bMult')) {
				input.disabled = true;
			}
			for (const input of document.getElementsByClassName('spinner')) {
				input.disabled = false;
			}
		}
	}
	
	reset() {
		this.stage = 1;
		this.cards = [false, false, false];
		this.sets = 0;
		this.cc = 0;
		this.terminal = false;
		this.boss = false;
	}
	
	expectedcc(n = 40000) {
		if (this.terminal) return this.cc;
		let avg = 0;
		for (let i = 0; i < n; i++) {
			let copy = this.copy();
			while (!copy.terminal && (i > 30 && (copy.cc < (avg/(i+1) || Infinity)) || !copy.boss)) {
				copy.spun(copy.spin());
			}
			avg += copy.cc;
		}
		return Math.round(avg/n);
	}
	
	spin() {
		if ((this.cc == 0 && this.stage != 1) || this.stage > 30) {
			// We've gone to far.
			this.terminal = true;
			return -1;
		} else if (this.stage == 30) {
			// Final Bonus
			return 0;
		} else if (this.boss) {
			let mult = this.constructor.bMult[this.boss][Math.floor(Math.random() * this.boss)];
			this.cc *= mult;
			if (this.cc == 0) {
				this.terminal = true;
				return -1;
			} else {
				this.cc = Math.round(this.cc);
				this.boss = 0;
				this.stage++;
				return -1;
			}
		} else {
			let roll = Math.random();
			for (let i = 1; i < 8; i++) {
				if (roll < this.constructor.pc[this.stage][i]) return i;
			}
		}
	}
	
	spin4boss() {
		while (!this.boss && !this.terminal) {
			game.spun(game.spin());
		}
	}
	
	bSpun(mult) {
		if (mult) {
			this.cc *= mult;
			this.cc = Math.round(this.cc);
			this.boss = 0;
			this.spun(1);
		} else {
			this.cc = 0;
			this.terminal = true;
			return true;
		}
	}
	
	spun(card) {
		switch (card) {
			case 0: // Final Bonus
				this.saveData.statistics[this.stage][0]++;
				this.terminal = true;
				this.cc *= 2; // I don't have enough information on how this works.
				this.stage++;
				break;
			case 1: // Unmatched cards or completed boss.
				this.saveData.statistics[this.stage][1]++;
				this.stage++;
				break;
			case 2: // Two bosses
				this.saveData.statistics[this.stage][2]++;
				this.boss = 2;
				break;
			case 3: // Three bosses
				this.saveData.statistics[this.stage][3]++;
				this.boss = 3;
				break;
			case 4: // Four bosses
				this.saveData.statistics[this.stage][4]++;
				this.boss = 4;
				break;
			case 5: // Blue card
				this.saveData.statistics[this.stage][5]++;
				this.cards[0] = true;
				this.cc += 10;
				this.stage++;
				break;
			case 6: // Pink card
				this.saveData.statistics[this.stage][6]++;
				this.cards[1] = true;
				this.cc += 30;
				this.stage++;
				break;
			case 7: // Yellow card
				this.saveData.statistics[this.stage][7]++;
				this.cards[2] = true;
				this.cc += 50;
				this.stage++;
				break;
		}
		
		if (card > 4 && this.cards[0] && this.cards[1] && this.cards[2]) {
			switch (this.sets) {
				case 0:
					this.cc += 100;
					this.sets = 1;
					break;
				case 1:
					this.cc += 300;
					this.sets = 2;
					break;
				default:
					this.cc += 500;
					break;
			}
			this.cards = [false, false, false];
		}
		
		return this.terminal;
	}
	
	// p[i][j] contains the probability of pulling j card on the ith stage.
	static p = [
		null,
		[0,0,0,0,0,0.3605,0.3325,0.307],
		[0,0,0,0,0,0.3605,0.3325,0.307],
		[0,0,0,0,0,0.3605,0.3325,0.307],
		[0,0,0,0,0,0.3605,0.3325,0.307],
		[0,0,0,0,0,0.3605,0.3325,0.307],
		[0,0,0,0.033033,0.124267,0.272,0.304,0.2667],
		[0,0,0,0.033033,0.124267,0.272,0.304,0.2667],
		[0,0,0,0.033033,0.124267,0.272,0.304,0.2667],
		[0,0,0,0.033033,0.124267,0.272,0.304,0.2667],
		[0,0,0,0.033033,0.124267,0.272,0.304,0.2667],
		[0,0,0.025223,0.116943,0.087134,0.3153,0.3439,0.1115],
		[0,0,0.025223,0.116943,0.087134,0.3153,0.3439,0.1115],
		[0,0,0.025223,0.116943,0.087134,0.3153,0.3439,0.1115],
		[0,0,0.025223,0.116943,0.087134,0.3153,0.3439,0.1115],
		[0,0,0.025223,0.116943,0.087134,0.3153,0.3439,0.1115],
		[0,0,0.075088,0.184832,0.02888,0.2778,0.3556,0.0778],
		[0,0,0.075088,0.184832,0.02888,0.2778,0.3556,0.0778],
		[0,0,0.075088,0.184832,0.02888,0.2778,0.3556,0.0778],
		[0,0,0.075088,0.184832,0.02888,0.2778,0.3556,0.0778],
		[0,0,0.075088,0.184832,0.02888,0.2778,0.3556,0.0778],
		[0,0,0.26013,0.11687,0,0.2623,0.2623,0.0984],
		[0,0,0.26013,0.11687,0,0.2623,0.2623,0.0984],
		[0,0,0.26013,0.11687,0,0.2623,0.2623,0.0984],
		[0,0,0.26013,0.11687,0,0.2623,0.2623,0.0984],
		[0,0,0.26013,0.11687,0,0.2623,0.2623,0.0984],
		[0,0,0.454545454545455,0,0,0.181818181818182,0.272727272727273,0.0909090909090909],
		[0,0,0.454545454545455,0,0,0.181818181818182,0.272727272727273,0.0909090909090909],
		[0,0,0.454545454545455,0,0,0.181818181818182,0.272727272727273,0.0909090909090909],
		[0,0,0.454545454545455,0,0,0.181818181818182,0.272727272727273,0.0909090909090909],
		[1,0,0,0,0,0,0,0]
	];
	
	static pc = [
		null,
		[0,0,0,0,0,0.3605,0.6930000000000001,1],
		[0,0,0,0,0,0.3605,0.6930000000000001,1],
		[0,0,0,0,0,0.3605,0.6930000000000001,1],
		[0,0,0,0,0,0.3605,0.6930000000000001,1],
		[0,0,0,0,0,0.3605,0.6930000000000001,1],
		[0,0,0,0.033033,0.1573,0.4293,0.7333000000000001,1],
		[0,0,0,0.033033,0.1573,0.4293,0.7333000000000001,1],
		[0,0,0,0.033033,0.1573,0.4293,0.7333000000000001,1],
		[0,0,0,0.033033,0.1573,0.4293,0.7333000000000001,1],
		[0,0,0,0.033033,0.1573,0.4293,0.7333000000000001,1],
		[0,0,0.025223,0.14216600000000001,0.2293,0.5446,0.8885,1],
		[0,0,0.025223,0.14216600000000001,0.2293,0.5446,0.8885,1],
		[0,0,0.025223,0.14216600000000001,0.2293,0.5446,0.8885,1],
		[0,0,0.025223,0.14216600000000001,0.2293,0.5446,0.8885,1],
		[0,0,0.025223,0.14216600000000001,0.2293,0.5446,0.8885,1],
		[0,0,0.075088,0.25992,0.2888,0.5666,0.9222,1],
		[0,0,0.075088,0.25992,0.2888,0.5666,0.9222,1],
		[0,0,0.075088,0.25992,0.2888,0.5666,0.9222,1],
		[0,0,0.075088,0.25992,0.2888,0.5666,0.9222,1],
		[0,0,0.075088,0.25992,0.2888,0.5666,0.9222,1],
		[0,0,0.26013,0.377,0.377,0.6393,0.9016,1],
		[0,0,0.26013,0.377,0.377,0.6393,0.9016,1],
		[0,0,0.26013,0.377,0.377,0.6393,0.9016,1],
		[0,0,0.26013,0.377,0.377,0.6393,0.9016,1],
		[0,0,0.26013,0.377,0.377,0.6393,0.9016,1],
		[0,0,0.454545454545455,0.454545454545455,0.454545454545455,0.6363636363636369,0.9090909090909098,1.0000000000000007],
		[0,0,0.454545454545455,0.454545454545455,0.454545454545455,0.6363636363636369,0.9090909090909098,1.0000000000000007],
		[0,0,0.454545454545455,0.454545454545455,0.454545454545455,0.6363636363636369,0.9090909090909098,1.0000000000000007],
		[0,0,0.454545454545455,0.454545454545455,0.454545454545455,0.6363636363636369,0.9090909090909098,1.0000000000000007],
		[1,1,1,1,1,1,1,1]
	];
	
	static bMult = [
		null,
		null,
		[0,1.8],
		[0,1.3,1.5],
		[0,1.2,1.3,1.4]
	]
}

let game = new Arkuma();
window.onload = () => {
	game.display();
	if (localStorage.getItem('saveData') && localStorage.getItem('buildNumber') >= 1) {
		game.saveData = JSON.parse(localStorage.getItem('saveData'));
	} else {
		localStorage.setItem('saveData', JSON.stringify(game.saveData));
		localStorage.setItem('buildNumber', 2);
	}
	setInterval(() => {
		localStorage.setItem('saveData', JSON.stringify(game.saveData));
	}, 60000);
}