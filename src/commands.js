import Actions from "./actions";

export default class Commands { 
    static help( channel ) { 
        return Actions.help( channel );
    }
}