import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  valueContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  valueValue: {
    width: 200,
    fontSize: 20
  },
  valueName: {
    width: 50,
    fontSize: 20,
    fontWeight: 'bold'
  },
  draglights: {
    // width: 200,
    height: 360,
    resizeMode: 'contain',
    // marginTop: 3,
    // marginLeft: -10,
  }
});