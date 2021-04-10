import React from 'react'
import {View,Text,SafeAreaView,StyleSheet,TextInput,TouchableOpacity,Image, Button} from 'react-native'
import HKU from '../assets/HKU.png'
import GoogleIcon from '../assets/google.png'
import { IconButton} from 'react-native-paper'


const LoginPage = () => {
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.centerbox}>
                <Text style={styles.title}>TimeFlex</Text>
                <Text style={styles.subtitle}>Calendar designed for HKU academia</Text>
                <View style={{width:250,height:320,alignItems:'center',marginTop:10}}>
                <Image source={HKU} style={styles.img}/>

                </View>
                <View style={{flexDirection:'row'}}>
                    {/* <Image source={GoogleIcon} style={{resizeMode:'contain',height:30,marginLeft:10}} /> */}
                    <Button title={`SING IN WITH GOOGLE`}/>
                </View>
                
                <Text>*Only available to HKU Connect accounts</Text>
                
            </View>
            
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container:{
        margin: "auto",
        flex:1,
        alignItems:'center',
        
        
    },
    centerbox:{
        alignItems:'center',
        flex:1
        // marginTop:40,
        // paddingBottom:270,
        // paddingLeft:140,
        // paddingRight:140,
        // borderEndWidth:1
        
        
    },
    title:{
        fontSize:40,
        marginTop:30,
        color:'#616161'
    },
    subtitle:{
        marginTop:20,
        fontSize:20
    },
    img:{
        width:300,
        height:300,
        resizeMode:'contain'

    },
    button:{
        marginBottom:10

    }
})



export default LoginPage
