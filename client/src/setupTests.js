import { configure,shallow,mount} from 'enzyme';
import 'react-testing-library/cleanup-after-each';
import 'jest-dom/extend-expect';
import Adapter from 'enzyme-adapter-react-16';
global.shallow = shallow
global.mount = mount
global.nextTick = function nextTick(){
	return new Promise(function(resolve){
		return setTimeout(resolve,40)
	})
};
global.findShallowIn = function findShallowIn(el,list){
	return list.reduce(function(node,selector){
		console.log(node.debug())
		try{
			node = node.dive()
		}catch(e){
			
		}
		if(selector === true){
			return node
		}
		let next = node.find(selector)
		return next
	},el)
}
configure({ adapter: new Adapter() });