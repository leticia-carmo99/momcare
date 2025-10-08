import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeMotherScreen from "./screens/WelcomeMother";
import LoginMotherScreen from "./screens/LoginMother";
import RegisterMotherScreen from "./screens/RegisterMother";
import HomeMotherScreen from "./screens/HomeMother";
import DailyScreen from "./screens/Daily";
import TasksMotherScreen from "./screens/TasksMother";
import ForumMotherScreen from "./screens/ForumMother";
import ProfileMotherScreen from "./screens/ProfileMother";
import ArticleScreen from "./screens/Article";
import CreateScreen from "./screens/Create";
import CommentScreen from "./screens/Comment";
import NewCommentScreen from "./screens/NewComment";
import PublicationScreen from "./screens/Publication";
import SeeAllScreen from "./screens/SeeAll";
import UserScreen from "./screens/User";
import WelcomeProfessionalScreen from "./screens/WelcomeProfessional";
import LoginProfessionalScreen from "./screens/LoginProfessional";
import RegisterProfessionalScreen from "./screens/RegisterProfessional";
import HomeProfessionalScreen from "./screens/HomeProfessional";
import RecentArticlesScreen from "./screens/RecentArticles";
import TasksProfessionalScreen from "./screens/TasksProfessional";
import ForumProfessionalScreen from "./screens/ForumProfessional";
import ProfileProfessionalScreen from "./screens/ProfileProfessional";
import SplashScreen from "./screens/Splash";
import VisibleProfileScreen from "./screens/VisibleProfile";
import PublishedArticlesScreen from "./screens/PublishedArticles";
import AppDrawer from "./AppDrawer";
import AddArticleScreen from "./screens/AddArticle";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="WelcomeMother" component={WelcomeMotherScreen} />
        <Stack.Screen name="LoginMother" component={LoginMotherScreen} />
        <Stack.Screen name="RegisterMother" component={RegisterMotherScreen} />
        <Stack.Screen name="HomeMother" component={AppDrawer} />
        <Stack.Screen name="Daily" component={DailyScreen} />
        <Stack.Screen name="TasksMother" component={TasksMotherScreen} />
        <Stack.Screen name="ForumMother" component={ForumMotherScreen} />
        <Stack.Screen name="ProfileMother" component={ProfileMotherScreen} />
        <Stack.Screen name="Article" component={ArticleScreen} />
        <Stack.Screen name="Create" component={CreateScreen} />
        <Stack.Screen name="Comment" component={CommentScreen} />
        <Stack.Screen name="NewComment" component={NewCommentScreen} />
        <Stack.Screen name="Publication" component={PublicationScreen} />
        <Stack.Screen name="SeeAll" component={SeeAllScreen} />
        <Stack.Screen name="User" component={UserScreen} />
        <Stack.Screen name="WelcomeProfessional" component={WelcomeProfessionalScreen} />
        <Stack.Screen name="LoginProfessional" component={LoginProfessionalScreen} />
        <Stack.Screen name="RegisterProfessional" component={RegisterProfessionalScreen} />
        <Stack.Screen name="HomeProfessional" component={HomeProfessionalScreen} />
        <Stack.Screen name="RecentArticles" component={RecentArticlesScreen} />
        <Stack.Screen name="TasksProfessional" component={TasksProfessionalScreen} />
        <Stack.Screen name="ForumProfessional" component={ForumProfessionalScreen} />
        <Stack.Screen name="ProfileProfessional" component={ProfileProfessionalScreen} />
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="VisibleProfile" component={VisibleProfileScreen} />
        <Stack.Screen name="PublishedArticles" component={PublishedArticlesScreen} />
        <Stack.Screen name="AddArticle" component={AddArticleScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
