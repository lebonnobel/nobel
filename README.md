# Le BoN Nobel
This is our awesome project for the course DH2321 Information Visualization 2017 at KTH.

## Get started
* Clone the repository to your computer using the [terminal](https://help.github.com/articles/cloning-a-repository/) or using [SourceTree](https://confluence.atlassian.com/sourcetreekb/clone-a-repository-into-sourcetree-780870050.html#ClonearepositoryintoSourceTree-Method#1-DirectlythroughtheSourceTree'sMainUI) (we have a **git** repository)
* To run our project locally you need to set up a local server. 
  * You can do this either by downloading [MAMP](https://www.mamp.info/en/) or a similar program. 
  * Or you can use [NodeJS](https://nodejs.org/en/). 
    * Install Node and open the terminal, go to where you cloned the repository
    * Write "npm install"
    * Write "npm start" -> Server is up and running!


## Workflow

### Coding guidelines
Keep the code nice and clean so it's easier for the other people in the group to change if necessary.
* Comment what you do!
* Remove things you don't use!
* Use clear variable names!

### Branches
We will try to work in git [branches](https://www.atlassian.com/git/tutorials/using-branches). 
> "This makes sure that unstable code is never committed to the main code base, and it gives you the chance to clean up your feature’s history before merging it into the main branch."

When you are about to make changes, create a new branch and work in the branch until you are finished. When you are finished, you can go to github.com and create a pull request and you will see if it's possible to merge your branch with master branch.

* Create a new branch and name it after your feature
  * [Create branch in terminal](https://github.com/Kunena/Kunena-Forum/wiki/Create-a-new-branch-with-git-and-manage-branches)
  * In SourceTree you click on the "Branch +" button and follow the instructions
* Do your awesome work in your branch (commit as much as you want)
* At any time you can push your branch 
  * [Push branch in terminal](http://stackoverflow.com/questions/2765421/how-to-push-a-new-local-branch-to-a-remote-git-repository-and-track-it-too)
  * In SourceTree
    * Click Push
    * Check your branch and name the remote branch the same as your branch
    * Click OK
* When you are done with your awesome feature, it's time to merge into the master branch. Do this by creating a pull request
  * First you should have pushed your branch
  * Go to our repository at github.com
  * Go to "Pull requests" and create a new one
  * Chose master as base and your branch to compare with
  * Name your pull request and describe what you have done
  * DONE!

### Model-view-controller
Since we are using [Angular](https://docs.angularjs.org/api), we are working with the [MVC pattern](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller). Our model is called service. 
> * The model is the central component of the pattern. It expresses the application's behavior in terms of the problem domain, independent of the user interface. It directly manages the data, logic and rules of the application.
> * A view can be any output representation of information, such as a chart or a diagram. Multiple views of the same information are possible, such as a bar chart for management and a tabular view for accountants.
> * The third part, the controller, accepts input and converts it to commands for the model or view.
