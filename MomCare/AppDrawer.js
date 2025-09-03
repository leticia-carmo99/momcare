import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeMotherScreen from "./screens/HomeMother";
import Menu from "./components/Menu"; 

const Drawer = createDrawerNavigator();

export default function AppDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <Menu {...props} />} 
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="HomeMother" component={HomeMotherScreen} />
    </Drawer.Navigator>
  );
}
