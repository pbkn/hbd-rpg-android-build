//=============================================================================
// Frogboy RMMV Plugin
// FrogTriggerDistance.js
//=============================================================================

//=============================================================================
/*:
 * @plugindesc v1.0 Trigger Events at a distance based on Radius or X/Y Axis
 * @author Frogboy
 *
 * @help
 * TriggerDistance v1.00
 * Author Frogboy
 *
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin is mainly used to avoid duplicating the same Event multiple 
 * times in order to cover more than one square.  By specifying your parameters
 * in the Note tag of an Event, the Event Touch Triggers can be fired when 
 * your Player is at a specified distance from the Event and/or on a certain 
 * axis.  I've also added functionality to list specific modes
 * of travel that will trigger an event.  Now you can fly your airship to a
 * floating island but not walk or sail into it from the ground.  Yay!
 *
 * ============================================================================
 * How to Use
 * ============================================================================
 * 
 * In the Note tag of an Event, use the command <TriggerDistance: parameters>
 * Parameters are separated by a space.
 *
 * The following parameters are supported.  Each one is immediately followed by
 * a number to specify the distance in squares/tiles that the Event sould fire.
 *    r#      - Radius (Any square within # of Event)
 *    x#      - X-Axis (Any square within # of Event on the X-Axis [left/right])
 *    y#      - Y-Axis (Any square within # of Event on the Y-Axis [up/down])
 *    s#      - Switch Binding (Will turn ON the specified Switch ID and not 
 *              fire again while the Switch is on)
 *
 * These can also be specified in the parameters to indicate which modes of 
 * travel this event will fire for.  If you specify none then an Event Touch
 * will always trigger.
 *    walk    - Tagged Event Touch will trigger if you are walking
 *    boat    - Tagged Event Touch will trigger if you are on your boat
 *    ship    - Tagged Event Touch will trigger if you are on your ship
 *    airship - Tagged Event Touch will trigger if you are on your airship
 * 
 * Examples:
 *    X-Axis
 *    <TriggerDistance: x5>
 *        Will cover the Event square and 5 tiles to the left and right of it.
 *        Great for spanning a hallway.
 *        #####E#####
 * 
 *    Y-Axis
 *    <TriggerDistance: y2>
 *        Will cover the Event square and 2 tiles above and below of it.
 *        #
 *        #
 *        E
 *        #
 *        #
 * 
 *    Radius
 *    <TriggerDistance: r3>
 *        Will cover the Event square and 3 tiles in all directions.
 *           #
 *          ###
 *         #####
 *        ###E###
 *         #####
 *          ###
 *           #
 * 
 *        <TriggerDistance: x999>
 *        Will cover the the entire edge of the top or bottom of a map.
 *        It doesn't have to be the top or bottom edge but that's what it is
 *        typically used for.  The number is set purposely large to cover any
 *        size map.
 * 
 *        <TriggerDistance: y999>
 *        Will cover the the entire edge of the left or right of a map.
 *        It doesn't have to be the left or right edge but that's what it is 
 *        typically used for.  The number is set purposely large to cover any
 *        size map.
 *
 *    Radius with Switch
 *    <TriggerDistance: r2 s12>
 *        Will cover the Event square and 2 tiles in all directions, will turn
 *        on Switch ID 12 and not fire an Event Toouch again while Switch 12 is
 *        ON.
 *           #
 *          ###
 *         ##E##
 *          ###
 *           #
 *
 *    Event Touch only fires when you are in your airship but not your ship
 *    <TriggerDistance: airship>
 *        No radius, x or y specified so this only covers the event tile
 *           E
 *
 * ============================================================================
 * Switch Property
 * ============================================================================
 *
 * I ran into an issue where my TriggerDistance fired and changed to a new 
 * Event page that was also Event Touch.  I didn't want the new Event page to 
 * trigger at a distance any longer and needed a way to disable the 
 * TriggerDistance.  So I created a way to specify a Switch that turns it off.  
 * The Switch will automatically turn on when the Event fires and not fire again 
 * unless you manually turn the Switch off again at a later time.
 *
 * In many situations, you'll just fire the Event once and Self Switch to a 
 * blank Action Button Trigger Event page so that it doesn't fire again.  In 
 * other cases, such as map edge transfers, they will stay active but teleport 
 * you somewhere else.  When you need to change from a TriggerDistance to a 
 * normal Event Touch page, you'll have to bind the event to a Switch if 
 * you need to disable the range/distance.
 *
 * ============================================================================
 * Terms of Use
 * ============================================================================
 *
 * While you can credit me if you'd like, I don't require it.  I made this for
 * me and am voluntarily sharing it with you if you want to use it.  There are
 * no restrictions.  Do whatever you want with it.
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.00 - Initial release
*/
//=============================================================================

(function() {
	Game_Player.prototype.startMapEvent = function(x, y, triggers, normal) {
		if (!$gameMap.isEventRunning()) {
			$gameMap.eventsXy(x, y).forEach(function(event) {
				console.log(event);
				if (event.isTriggerIn(triggers)) {
					console.log(event);
					event.start();
				}
			});
		}
	};
	
	Game_Map.prototype.eventsXy = function(x, y) {
		var return_events = [];
		for (var i=0; i<this.events().length; i++) {
			var event = this.events()[i];
			var meta = (event.event() && event.event().meta) ? event.event().meta : null;
			if (meta && meta.hasOwnProperty("TriggerDistance") && event._trigger === 2) {
				data = meta.TriggerDistance.toString();
				var tdx = -1;
				var tdy = -1;
				var tdr = -1;
				var tdSwitch = 0;
				var bOk = false;
				var walk = false;
				var boat = false;
				var ship = false;
				var airship = false;
				var vehicle = $gamePlayer._vehicleType;
				var arr = (data.indexOf(" ") >= 0) ? data.split(' ') : [data];
				
				for (var j=0; j<arr.length; j++)
				{
					if (arr[j].trim() != "")
					{
						if (arr[j].toLowerCase().trim() == "walk") {
							walk = true;
						}
						else if (arr[j].toLowerCase().trim() == "boat") {
							boat = true;
						}
						else if (arr[j].toLowerCase().trim() == "ship") {
							ship = true;
						}
						else if (arr[j].toLowerCase().trim() == "airship") {
							airship = true;
						}
						else {
							switch (arr[j].charAt(0).toLowerCase())
							{
								case 'r': 
									tdr = parseInt(arr[j].substr(1) || -1);
									bOk = true;
									break;
								case 'x': 
									tdx = parseInt(arr[j].substr(1) || -1);
									bOk = true;
									break;
								case 'y': 
									tdy = parseInt(arr[j].substr(1) || -1);
									bOk = true;
									break;
								case 's': 
									tdSwitch = parseInt(arr[j].substr(1) || 0);
									break;
							}
						}
					}
				}
				
				// If non specified then all apply
				if (walk == false && boat == false && ship == false && airship == false) {
					walk = true;
					boat = true;
					ship = true;
					airship = true;
				}
				
				// If no Trigger Distance specified, assume Radius zero
				if (bOk == false) {
					tdr = 0;
				};
				
				// Make sure travel mode is valid
				if (((walk == true && vehicle == "walk") || (boat == true && vehicle == "boat") || 
					(ship == true && vehicle == "ship") || (airship == true && vehicle == "airship")) &&
					(tdSwitch < 0 || !$gameSwitches.value(tdSwitch)))
				{
					var distance = Math.abs(event.deltaXFrom(x)) + Math.abs(event.deltaYFrom(y));

					// Check Radius Trigger
					if (tdr > -1 && distance <= tdr)
					{
						if (tdSwitch > 0)
						{
							$gameSwitches.setValue(tdSwitch, true);
						}
						return_events.push(event);
					}

					// Check X-Axis Trigger
					if (tdx > -1 && distance <= tdx && y === event.y)
					{
						if (tdSwitch > 0)
						{
							$gameSwitches.setValue(tdSwitch, true);
						}
						return_events.push(event);
					}

					// Check Y-Axis Trigger
					if (tdy > -1 && distance <= tdy && x === event.x)
					{
						if (tdSwitch > 0)
						{
							$gameSwitches.setValue(tdSwitch, true);
						}
						return_events.push(event);
					}
				}
			}
			else if (event._x == x && event._y == y) {
				if (!$gamePlayer.isInAirship()) {
					return_events.push(event);
				}
			}
		}
		
		return return_events;
	};
	
	Game_Player.prototype.canStartLocalEvents = function() {
		return true;
	};
})();
