var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppAPI = require('../utils/AppAPI.js')

var CHANGE_EVENT = 'change';

var _workouts = [];
var _showForm = false;

var AppStore = assign({},EventEmitter.prototype,{
	showForm: function(){
		_showForm = true;
	},
	getShowForm: function(){
		return _showForm;
	},
	addWorkout:function(workout){
		_workouts.push(workout);
	},
	getWorkouts:function(){
		return _workouts;
	},
	receiveWorkouts:function(workouts){
		_workouts = workouts;
	},
	removeWorkout:function(workoutId){
		// var index =_workouts.findIndex(x => x.id === workoutId);
		function findIndex(_workouts,workoutId){
			for(var i=0,len=_workouts.length;i<len;i++){
				if(_workouts[i]._id === workoutId){
					return i;
				}
			}
			return -1;
		}
		var index = findIndex(_workouts,workoutId);
		_workouts.splice(index,1);
	},
	emitChange:function(){
		this.emit(CHANGE_EVENT);
	},
	addChangeListener: function(callback){
		this.on('change',callback);
	},
	removeChangeListener:function(callback){
		this.removeListener('change',callback);
	}
});

AppDispatcher.register(function(payload){
	var action = payload.action;

	switch(action.actionType){
		case AppConstants.SHOW_FORM:
			AppStore.showForm();
			AppStore.emit(CHANGE_EVENT);
			break;
		case AppConstants.ADD_WORKOUT:
			AppStore.addWorkout(action.workout);
			AppAPI.addWorkout(action.workout);
			AppStore.emit(CHANGE_EVENT);
			break;
		case AppConstants.RECEIVE_WORKOUTS:
			AppStore.receiveWorkouts(action.workouts);
			AppStore.emit(CHANGE_EVENT);
			break;
		case AppConstants.REMOVE_WORKOUT:
			AppStore.removeWorkout(action.workoutId);
			AppAPI.removeWorkout(action.workoutId);
			AppStore.emit(CHANGE_EVENT);
			break;
	}

	return true;
})

module.exports = AppStore;