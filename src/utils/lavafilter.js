const { Structure } = require('erela.js')

module.exports = Structure.extend('Player', Player => {
  class Lava extends Player {
    constructor ( ... args ) {
      super( ... args )
      this.speed = 1
      this.pitch = 1
      this.rate = 1
      this._8d = false
      this.nightcore = false
      this.vaporwave = false
      this.bassboost = false
      this.distortion = false
    }

    set8D () {
      if (!this.filters) this.filters = true
      this._8d = true

      if (this._8d) {
        this.node.send({
          op: "filters",
          guildId: this.guild,
          rotation: {
            rotationHz: 0.2
          }
        })
      }

      return this
    }

    setSpeed() {
      this.speed = 2
      this.setTimescale(2)
      return this
    }

    setPitch() {
      this.pitch = 2
      this.setTimescale(2)
      return this
    }

    setNightcore(args) {
      this.nightcore = true

      this.nightcore = args
      if (args) {
        this.bassboost = false
        this.distortion = false
        this.vaporwave = false
        this.setVaporwave(false)
        this.setBassboost(false)
        this.setTimescale(1.2999999523162842, 1.2999999523162842, 1)
      } else {
        this.setTimescale(1, 1, 1)
      }
      return this
    }

    setVaporwave(args) {
      this.vaporwave = args;

			if (args) {
				this.nightcore = false;
				this.bassboost = false;
				this.distortion = false;
				this.setBassboost(false);
				this.setNightcore(false);
				this.setTimescale(0.8500000238418579, 0.800000011920929, 1);
			} else {
				this.setTimescale(1, 1, 1);
			}
			return this;
    }

    setBassboost(args) {
      this.bassboost = args;

			if (args) {
				this.nightcore = false;
				this.vaporwave = false;
				this.setVaporwave(false);
				this.setNightcore(false);
				this.setEqualizer(1, 0.85);
			} else {
				this.clearEffects();
			}
			return this;
    }

    setEqualizer(band, gain) {
      this.band = band || this.band;
			this.gain = gain || this.gain;

			this.node.send({
				op: 'filters',
				guildId: this.guild,
				equalizer: [
					{
						band: this.band,
						gain: this.gain,
					},
					{
						band: this.band,
						gain: this.gain,
					},
					{
						band: this.band,
						gain: this.gain,
					},
					{
						band: this.band,
						gain: this.gain,
					},
					{
						band: this.band,
						gain: this.gain,
					},
					{
						band: this.band,
						gain: this.gain,
					},
				],
			});
			return this;
    }
    
    setTimescale(speed, pitch, rate) {
			this.speed = speed || this.speed;
			this.pitch = pitch || this.pitch;
			this.rate = rate || this.rate;

			this.node.send({
				op: 'filters',
				guildId: this.guild,
				timescale: {
					speed: this.speed,
					pitch: this.pitch,
					rate: this.rate,
				},
			});
			return this;
		}

    clearEffects() {
			this.speed = 1;
			this.pitch = 1;
			this.rate = 1;
			this.bassboost = false;
			this.nightcore = false;
			this.vaporwave = false;
			this.distortion = false;
			this.clearEQ();

			this.node.send({
				op: 'filters',
				guildId: this.guild,
			});
			return this;
		}
  }

  return Lava
})