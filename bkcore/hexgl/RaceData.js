 /*
 * HexGL
 * @author Thibaut 'BKcore' Despoulain <http://bkcore.com>
 * @license This work is licensed under the Creative Commons Attribution-NonCommercial 3.0 Unported License. 
 *          To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/3.0/.
 */

var bkcore = bkcore || {};
bkcore.hexgl = bkcore.hexgl || {};

bkcore.hexgl.RaceData = function(track, mode, shipControls)
{
	this.track = track;
	this.mode = mode;
	this.shipControls = shipControls;

	this.rate = 2; // 1 / rate
	this.rateState = 1;

	this.data = [];
	this.last = -1;
	this.seek = 0;

	this._p = new THREE.Vector3();
	this._q = new THREE.Quaternion();
}

bkcore.hexgl.RaceData.prototype.tick = function(time)
{
	if(this.rateState == 1)
	{
		this.data.push(new bkcore.hexgl.RaceTick(
			time,
			this.shipControls.getPosition(),
			this.shipControls.getQuaternion()
		));
		++this.last;
	}
	else if(this.rateState == this.rate)
	{
		this.rateState = 0;
	}
	
	this.rate++;
}

bkcore.hexgl.RaceData.prototype.applyInterpolated = function(time)
{
	while(this.seek < this.last && this.data[this.seek+1].time < time)
		++this.seek;

	var prev = this.data[this.seek];

	if(this.seek < 0)
	{
		console.warn('Bad race data.');
		return;
	}

	// no interpolation
	if(this.seek == this.last || this.seek == 0)
		this.shipControls.teleport(prev.position, prev.quaternion);

	// interpolation
	var next = this.data[this.seek+1];
	var t = (time-prev.time) / (next.time-prev.time);
	this._p.copy(prev.position).lerpSelf(next.position, t);
	this._q.copy(prev.quaternion).slerpSelf(next.quaternion, t);
	
	this.shipControls.teleport(this._p, this._q);
}

bkcore.hexgl.RaceData.prototype.reset = function()
{
	this.seek = 0;
}

bkcore.hexgl.RaceData.prototype.export = function()
{
	var exp = [];
	for(var i = 0; i <= this.last; i++)	exp.push(
			[this.data[i].time,
			this.data[i].position.x,
			this.data[i].position.y,
			this.data[i].position.z,
			this.data[i].quaternion.x,
			this.data[i].quaternion.y,
			this.data[i].quaternion.z,
			this.data[i].quaternion.w]
		);

	return exp;
}

bkcore.hexgl.RaceData.prototype.import = function(imp)
{
	this.data = [];
	for(var i = 0; i <= this.last; i++)
	{
		this.data.push(new bkcore.hexgl.RaceTick(
			imp[i][0],
			new THREE.Vector3(imp[i][1], imp[i][2], imp[i][3]),
			new THREE.Quaternion(imp[i][4], imp[i][5], imp[i][6], imp[i][7])
		));
	}

	return exp;
}

bkcore.hexgl.RaceTick = function(time, position, quaternion)
{
	this.time = time;
	this.position = position;
	this.quaternion = quaternion;
}