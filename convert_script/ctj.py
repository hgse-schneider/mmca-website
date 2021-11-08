# CTJ => Convert to JSON

import csv 
import json


# function to add to JSON
def write_json(new_data, filename="", mode=""):
    with open(filename,'r+') as file:
        if mode == "nodes":
            # First we load existing data into a dict.
            file_data = json.load(file)
            # Join new_data with file_data inside emp_details
            file_data["nodes"].append(new_data)
            # Sets file's current position at offset.
            file.seek(0)
            # convert back to json.
            json.dump(file_data, file, indent = 4)
        elif mode == "links":
            # First we load existing data into a dict.
            file_data = json.load(file)
            # Join new_data with file_data inside emp_details
            file_data["links"].append(new_data)
            # Sets file's current position at offset.
            file.seek(0)
            # convert back to json.
            json.dump(file_data, file, indent = 4)
        else:
            print("Do not understand")


# List of URLs and there respective names
def determine_url(data_link=""):
    if data_link == "Privacy-Preserving Speech Analytics for Automatic Assessment of Student Collaboration":
        return "Privacy-Preserving%20Speech%20Analytics%20for%20Automatic%20Assessment%20of%20Student%20Collaboration"
    elif data_link == "See What I’m Saying? Using Dyadic Mobile Eye Tracking to Study Collaborative Reference":
        return "See%20What%20I’m%20Saying?%20Using%20Dyadic%20Mobile%20Eye%20Tracking%20to%20Study%20Collaborative%20Reference"
    elif data_link == "Detecting Collaborative Dynamics Using Mobile Eye-Trackers":
        return "Detecting%20Collaborative%20Dynamics%20Using%20Mobile%20Eye-Trackers"
    elif data_link == "Employing Social Gaze and Speaking Activity for Automatic Determination of the Extraversion Trait":
        return "Employing%20Social%20Gaze%20and%20Speaking%20Activity%20for%20Automatic%20Determination%20of%20the%20Extraversion%20Trait"
    elif data_link == "Improving Visibility of Remote Gestures in Distributed Tabletop Collaboration":
        return "Improving%20Visibility%20of%20Remote%20Gestures%20in%20Distributed%20Tabletop%20Collaboration"
    elif data_link == "Using the Tablet Gestures and Speech of Pairs of Students to Classify Their Collaboration":
        return "Using%20the%20Tablet%20Gestures%20and%20Speech%20of%20Pairs%20of%20Students%20to%20Classify%20Their%20Collaboration"
    elif data_link == "Body synchrony in triadic interaction":
        return "Body%20synchrony%20in%20triadic%20interaction"
    elif data_link == "Effects of Shared Gaze on Audio- Versus Text-Based Remote Collaborations":
        return "Effects%20of%20Shared%20Gaze%20on%20Audio-%20Versus%20Text-Based%20Remote%20Collaborations"
    elif data_link == "Predicting Collaborative Learning Quality through Physiological Synchrony Recorded by Wearable Biosensors":
        return "Predicting%20Collaborative%20Learning%20Quality%20through%20Physiological%20Synchrony%20Recorded%20by%20Wearable%20Biosensors"
    elif data_link == "Multi-modal Social Signal Analysis for Predicting Agreement in Conversation Settings":
        return "Multi-modal%20Social%20Signal%20Analysis%20for%20Predicting%20Agreement%20in%20Conversation%20Settings"
    elif data_link == "Brain-to-Brain Synchrony Tracks Real-World Dynamic Group Interactions in the Classroom":
        return "Brain-to-Brain%20Synchrony%20Tracks%20Real-World%20Dynamic%20Group%20Interactions%20in%20the%20Classroom"
    elif data_link == "Physiological evidence of interpersonal dynamics in a cooperative production task":
        return "Physiological%20evidence%20of%20interpersonal%20dynamics%20in%20a%20cooperative%20production%20task"
    elif data_link == "What does physiological synchrony reveal about metacognitive experiences and group performance?":
        return "What%20does%20physiological%20synchrony%20reveal%20about%20metacognitive%20experiences%20and%20group%20performance?"
    elif data_link == "Using Motion Sensors to Understand Collaborative Interactions in Digital Fabrication Labs":
        return "Using%20Motion%20Sensors%20to%20Understand%20Collaborative%20Interactions%20in%20Digital%20Fabrication%20Labs"
    elif data_link == "Modelling and Identifying Collaborative Situations in a Collocated Multi-display Groupware Setting":
        return "Modelling%20and%20Identifying%20Collaborative%20Situations%20in%20a%20Collocated%20Multi-display%20Groupware%20Setting"
    elif data_link == "An Automatic Approach for Mining Patterns of Collaboration around an Interactive Tabletop":
        return "An%20Automatic%20Approach%20for%20Mining%20Patterns%20of%20Collaboration%20around%20an%20Interactive%20Tabletop"
    elif data_link == "Detecting Emergent Leader in a Meeting Environment":
        return "Detecting%20Emergent%20Leader%20in%20a%20Meeting%20Environment"
    elif data_link == "Moving as a Leader: Detecting Emergent Leadership in Small Groups using Body Pose":
        return "Moving%20as%20a%20Leader:%20Detecting%20Emergent%20Leadership%20in%20Small%20Groups%20using%20Body%20Pose"
    elif data_link == "Using Physiological Synchrony as an Indicator of Collaboration Quality, Task Performance and Learning":
        return "Using%20Physiological%20Synchrony%20as%20an%20Indicator%20of%20Collaboration%20Quality,%20Task%20Performance%20and%20Learning"
    elif data_link == "Focused or Stuck Together: Multimodal Patterns Reveal Triads’ Performance in Collaborative Problem Solving":
        return "Focused%20or%20Stuck%20Together:%20Multimodal%20Patterns%20Reveal%20Triads’%20Performance%20in%20Collaborative%20Problem%20Solving"
    elif data_link == "Multimodal Analysis of Vocal Collaborative Search:A Public Corpus and Results":
        return "Multimodal%20Analysis%20of%20Vocal%20Collaborative%20Search:A%20Public%20Corpus%20and%20Results"
    elif data_link == "Investigating collaborative learning success with physiological coupling indices based on electrodermal activity":
        return "Investigating%20collaborative%20learning%20success%20with%20physiological%20coupling%20indices%20based%20on%20electrodermal%20activity"
    elif data_link == "Real-time mutual gaze perception":
        return "Real-time%20mutual%20gaze%20perception"
    elif data_link == "Exploring Collaboration Using Motion Sensors and Multi-Modal Learning Analytics":
        return "Exploring%20Collaboration%20Using%20Motion%20Sensors%20and%20Multi-Modal%20Learning%20Analytics"
    elif data_link == "3D Tangibles Facilitate Joint Visual Attention in Dyads":
        return "3D%20Tangibles%20Facilitate%20Joint%20Visual%20Attention%20in%20Dyads"
    elif data_link == "Unpacking Collaborative Learning Processes during Hands-on Activities using Mobile Eye-Trackers":
        return "Unpacking%20Collaborative%20Learning%20Processes%20during%20Hands-on%20Activities%20using%20Mobile%20Eye-Trackers"
    elif data_link == "Estimation of success in collaborative learning based on multimodal learning analytics features":
        return "Estimation%20of%20success%20in%20collaborative%20learning%20based%20on%20multimodal%20learning%20analytics%20features"
    elif data_link == "Multimodal prediction of expertise and leadership in learning groups":
        return "Multimodal%20prediction%20of%20expertise%20and%20leadership%20in%20learning%20groups"
    elif data_link == "Supervised machine learning in multimodal learning analytics for estimating success in project-based learning":
        return "Supervised%20machine%20learning%20in%20multimodal%20learning%20analytics%20for%20estimating%20success%20in%20project-based%20learning"
    elif data_link == "Toward Collaboration Sensing":
        return "Toward%20Collaboration%20Sensing"
    elif data_link == "Task-independent Multimodal Prediction of Group Performance Based on Product Dimensions":
        return "Task-independent%20Multimodal%20Prediction%20of%20Group%20Performance%20Based%20on%20Product%20Dimensions"
    elif data_link == "Going beyond what is visible: What multichannel data can reveal about interaction in the context of collaborative learning?":
        return "Going%20beyond%20what%20is%20visible:%20What%20multichannel%20data%20can%20reveal%20about%20interaction%20in%20the%20context%20of%20collaborative%20learning?"
    elif data_link == "An Alternate Statistical Lens to Look at Collaboration Data: Extreme Value Theory":
        return "An%20Alternate%20Statistical%20Lens%20to%20Look%20at%20Collaboration%20Data:%20Extreme%20Value%20Theory"
    elif data_link == "Toward Using Multi-Modal Learning Analytics to Support and Measure Collaboration in Co-Located Dyads":
        return "Toward%20Using%20Multi-Modal%20Learning%20Analytics%20to%20Support%20and%20Measure%20Collaboration%20in%20Co-Located%20Dyads"
    elif data_link == "Modeling Collaboration Patterns on an Interactive Tabletop in a Classroom Setting":
        return "Modeling%20Collaboration%20Patterns%20on%20an%20Interactive%20Tabletop%20in%20a%20Classroom%20Setting"
    elif data_link == "Using Multimodal Learning Analytics to Identify Aspects of Collaboration in Project-Based Learning":
        return "Using%20Multimodal%20Learning%20Analytics%20to%20Identify%20Aspects%20of%20Collaboration%20in%20Project-Based%20Learning"
    elif data_link == "Shared Experiences of Technology and Trust: An Experimental Study of Physiological Compliance Between Active and Passive Users in Technology-Mediated Collaborative Encounters":
        return "Shared%20Experiences%20of%20Technology%20and%20Trust:%20An%20Experimental%20Study%20of%20Physiological%20Compliance%20Between%20Active%20and%20Passive%20Users%20in%20Technology-Mediated%20Collaborative%20Encounters"
    elif data_link == "Predicting the Quality of Collaborative Problem Solving Through Linguistic Analysis of Discourse":
        return "Predicting%20the%20Quality%20of%20Collaborative%20Problem%20Solving%20Through%20Linguistic%20Analysis%20of%20Discourse"
    elif data_link == "Emergent leaders through looking and speaking: from audio-visual data to multimodal recognition":
        return "Emergent%20leaders%20through%20looking%20and%20speaking:%20from%20audio-visual%20data%20to%20multimodal%20recognition"
    elif data_link == "Does Seeing One Another’s Gaze Affect Group Dialogue?":
        return "Does%20Seeing%20One%20Another’s%20Gaze%20Affect%20Group%20Dialogue?"
    elif data_link == "Dynamics of Visual Attention in Multiparty Collaborative Problem Solving using Multidimensional Recurrence Quantification Analysis":
        return "Dynamics%20of%20Visual%20Attention%20in%20Multiparty%20Collaborative%20Problem%20Solving%20using%20Multidimensional%20Recurrence%20Quantification%20Analysis"
    elif data_link == "Using Interlocutor-Modulated Attention BLSTM to Predict Personality Traits in Small Group Interaction":
        return "Using%20Interlocutor-Modulated%20Attention%20BLSTM%20to%20Predict%20Personality%20Traits%20in%20Small%20Group%20Interaction"
    elif data_link == "High Accuracy Detection of Collaboration From Log Data and Superficial Speech Features":
        return "High%20Accuracy%20Detection%20of%20Collaboration%20From%20Log%20Data%20and%20Superficial%20Speech%20Features"
    elif data_link == "Investigating Automatic Dominance Estimation in Groups From Visual Attention and Speaking Activity":
        return "Investigating%20Automatic%20Dominance%20Estimation%20in%20Groups%20From%20Visual%20Attention%20and%20Speaking%20Activity"
    elif data_link == "Personality classification and behaviour interpretation: An approach based on feature categories":
        return "Personality%20classification%20and%20behaviour%20interpretation:%20An%20approach%20based%20on%20feature%20categories"
    elif data_link == "Using Mobile Eye-Trackers to Unpack the Perceptual Benefits of a Tangible User Interface for Collaborative Learning":
        return "Using%20Mobile%20Eye-Trackers%20to%20Unpack%20the%20Perceptual%20Benefits%20of%20a%20Tangible%20User%20Interface%20for%20Collaborative%20Learning"
    elif data_link == "Can Eye Help You?: Effects of Visualizing Eye Fixations on Remote Collaboration Scenarios for Physical Tasks":
        return "Can%20Eye%20Help%20You?:%20Effects%20of%20Visualizing%20Eye%20Fixations%20on%20Remote%20Collaboration%20Scenarios%20for%20Physical%20Tasks"
    elif data_link == "Acoustic-Prosodic Entrainment and Rapport in Collaborative Learning Dialogues":
        return "Acoustic-Prosodic%20Entrainment%20and%20Rapport%20in%20Collaborative%20Learning%20Dialogues"
    elif data_link == "Gaze quality assisted automatic recognition of social contexts in collaborative Tetris":
        return "Gaze%20quality%20assisted%20automatic%20recognition%20of%20social%20contexts%20in%20collaborative%20Tetris"
    elif data_link == "Leveraging Mobile Eye-Trackers to Capture Joint Visual Attention in Co-Located Collaborative Learning":
        return "Leveraging%20Mobile%20Eye-Trackers%20to%20Capture%20Joint%20Visual%20Attention%20in%20Co-Located%20Collaborative%20Learning"
    elif data_link == "Modeling Team-level Multimodal Dynamics during Multiparty Collaboration":
        return "Modeling%20Team-level%20Multimodal%20Dynamics%20during%20Multiparty%20Collaboration"
    elif data_link == "Unpacking the relationship between existing and new measures of physiological synchrony and collaborative learning: a mixed methods study":
        return "Unpacking%20the%20relationship%20between%20existing%20and%20new%20measures%20of%20physiological%20synchrony%20and%20collaborative%20learning:%20a%20mixed%20methods%20study"
    elif data_link == "Unraveling Students' Interaction around a Tangible Interface Using Multimodal Learning Analytics.":
        return "Unraveling%20Students%27%20Interaction%20around%20a%20Tangible%20Interface%20Using%20Multimodal%20Learning%20Analytics."
    elif data_link == "Automatic identification of experts and performance prediction in the multimodal math data corpus through analysis of speech interaction. ":
        return "Automatic%20identification%20of%20experts%20and%20performance%20prediction%20in%20the%20multimodal%20math%20data%20corpus%20through%20analysis%20of%20speech%20interaction."
    elif data_link == "Capturing and analyzing verbal and physical collaborative learning interactions at an enriched interactive tabletop":
        return "Capturing%20and%20analyzing%20verbal%20and%20physical%20collaborative%20learning%20interactions%20at%20an%20enriched%20interactive%20tabletop"
    elif data_link == "Dynamic Adaptive Gesturing Predicts Domain Expertise in Mathematics":
        return "Dynamic%20Adaptive%20Gesturing%20Predicts%20Domain%20Expertise%20in%20Mathematics"
    elif data_link == "Personality Trait Classification via Co-Occurrent Multiparty Multimodal Event Discovery":
        return "Personality%20Trait%20Classification%20via%20Co-Occurrent%20Multiparty%20Multimodal%20Event%20Discovery"
    elif data_link == "Expertise estimation based on simple multimodal features":
        return "Expertise%20estimation%20based%20on%20simple%20multimodal%20features"
    elif data_link == "The Effect of Mutual Gaze Perception on Students’ Verbal Coordination":
        return "The%20Effect%20of%20Mutual%20Gaze%20Perception%20on%20Students’%20Verbal%20Coordination"
    elif data_link == "Analysing frequent sequential patterns of collaborative learning activity around an interactive tabletop":
        return "Analysing%20frequent%20sequential%20patterns%20of%20collaborative%20learning%20activity%20around%20an%20interactive%20tabletop"
    elif data_link == "Using Eye-Tracking Technology to Support Visual Coordination in Collaborative Problem-Solving Groups":
        return "Using%20Eye-Tracking%20Technology%20to%20Support%20Visual%20Coordination%20in%20Collaborative%20Problem-Solving%20Groups"
    elif data_link == "Dual Gaze as a Proxy for Collaboration in Informal Learning":
        return "Dual%20Gaze%20as%20a%20Proxy%20for%20Collaboration%20in%20Informal%20Learning"
    elif data_link == "(Dis)Engagement Maters: Identifying Efficacious Learning Practices with Multimodal Learning Analytics":
        return "(Dis)Engagement%20Maters:%20Identifying%20Efficacious%20Learning%20Practices%20with%20Multimodal%20Learning%20Analytics"
    elif data_link == "The Additive Value of Multimodal Features for Predicting Engagement, Frustration, and Learning during Tutoring":
        return "The%20Additive%20Value%20of%20Multimodal%20Features%20for%20Predicting%20Engagement,%20Frustration,%20and%20Learning%20during%20Tutoring"
    elif data_link == "A Network Analytic Approach to Gaze Coordination during a Collaborative Task":
        return "A%20Network%20Analytic%20Approach%20to%20Gaze%20Coordination%20during%20a%20Collaborative%20Task"
    elif data_link == "Looking AT versus Looking THROUGH: A Dual Eye-tracking Study in MOOC Context":
        return "Looking%20AT%20versus%20Looking%20THROUGH:%20A%20Dual%20Eye-tracking%20Study%20in%20MOOC%20Context"
    elif data_link == "Predicting Group Performance in Task-Based Interaction":
        return "Predicting%20Group%20Performance%20in%20Task-Based%20Interaction"
    elif data_link == "Automatic Recognition of Affective Laughter in Spontaneous Dyadic Interactions from Audiovisual Signals":
        return "Automatic%20Recognition%20of%20Affective%20Laughter%20in%20Spontaneous%20Dyadic%20Interactions%20from%20Audiovisual%20Signals"
    elif data_link == "Linking Speaking and Looking Behavior Patterns with Group Composition, Perception, and Performance":
        return "Linking%20Speaking%20and%20Looking%20Behavior%20Patterns%20with%20Group%20Composition,%20Perception,%20and%20Performance"
    elif data_link == "Are we together or not? The temporal interplay of monitoring, physiological arousal and physiological synchrony during a collaborative exam":
        return "Are%20we%20together%20or%20not?%20The%20temporal%20interplay%20of%20monitoring,%20physiological%20arousal%20and%20physiological%20synchrony%20during%20a%20collaborative%20exam"
    elif data_link == "A Multimodal-Sensor-Enabled Room for Unobtrusive Group Meeting Analysis":
        return "A%20Multimodal-Sensor-Enabled%20Room%20for%20Unobtrusive%20Group%20Meeting%20Analysis"
    elif data_link == "Physiological Linkage of Dyadic Gaming Experience":
        return "Physiological%20Linkage%20of%20Dyadic%20Gaming%20Experience"
    elif data_link == "Understanding collaborative program comprehension: Interlacing gaze and dialogues":
        return "Understanding%20collaborative%20program%20comprehension:%20Interlacing%20gaze%20and%20dialogues"
    elif data_link == "An Interactive Table for Supporting Participation Balance in Face-to-Face Collaborative Learning":
        return "An%20Interactive%20Table%20for%20Supporting%20Participation%20Balance%20in%20Face-to-Face%20Collaborative%20Learning"
    else:
        return "Unknown"



# Main function that converts data
def determine_layer(reader, data_link="", data_layer=1):
    i = 1 # counter
    parent = {
        "id": 0,
        "name": data_link,
        "url": "parent"
    }
    curr_dict = {"nodes": {}, "links": {}} # dictionary that stores the JSON converted data
    if data_link == "gaze / eye direction": # just to make sure that it ends up as "eye motion"
        parent["name"] = "eye motion"
    if data_link == "verbal content": # just to make sure that it ends up as "speech content"
        parent = "'id': {}, 'name': '{}', 'url': '{}'".format(0, "speech content", "parent")
        parent["name"] = "speech content"
    if data_link == "individual cognitive processes":
        parent["name"] = "cognitive engagement"
    if data_link == "affective state":
        parent["name"] = "affective"
    if data_link == "interpersonal relationship / perception":
        parent["name"] = "interpersonal"
    curr_dict["nodes"][parent["name"]] = 1 # add to dictionary 
    # write_to_file(parent) # write the very first and parent node to the txt file
    write_json(parent, "test_folder/test.json", "nodes")

    for row in reader:
        assumed = row[data_layer] 

        if data_link == assumed:
            url_title = row[1] # gscholar link name
            name = row[2] # name of the node
            if name in curr_dict["nodes"]: # if the name of node already exists in the dictionary
                curr_dict["nodes"][name] += 1 # increment the number if times it appears
            else:
                curr_dict["nodes"][name] = 1 # new so add to dictionary 
                url_link = determine_url(url_title) # determine the URL based on the name
                if url_link == "Unknown": # If the URL is unidentified, print the name of the node
                    print(name)
                node_ans = {
                    "id": i,
                    "name": name,
                    "url": url_link
                }
                # write_to_file(node_ans) # writes to file
                write_json(node_ans, "test_folder/test.json", "nodes")
                i += 1

    j = 0 # counter
    for node in curr_dict["nodes"]:
        if "parent" not in node:
            link_ans = {
                "source": j, 
                "target": 0, 
                "linelevel": curr_dict["nodes"].get(node)
            }
            write_json(link_ans, "test_folder/test.json", "links")
            # write_to_file(link_ans) # writes to file
        j += 1
    print("Complete ==> Please take a look at data.txt")


def write_to_file(res=""):
    f = open("data.txt", "a") # open the file
    format_res = "{" + res + "}," # format to JSON-like 
    f.write(format_res + "\n") # write to file and add new line
    f.close() # close


def get_data():
    user_input = input("Input data file you need to convert (e.g. gaze / eye direction, verbal, speech content, ...): ")
    data_layer = int(input("Input data metric layer: "))
    with open('df_website.csv', 'r') as file:
        f = open("data.txt", "w") # clear data.txt file of content
        reader = csv.reader(file)
        if data_layer == 1:
            # visual attention, eye motion, text, touch
            # 3
            print("layer 1")
            determine_layer(reader, user_input, 3)
        elif data_layer == 2:
            # Gaze, Log Data, Body, Head
            # 4
            print("layer 2")
            determine_layer(reader, user_input, 4)
        elif data_layer == 3:
            # Group Composition, Performance, Learning, Affective
            # 6
            print("layer 3")
            determine_layer(reader, user_input, 6)
        elif data_layer == 4:
            # Condition, Product, Process
            # 7
            print("layer 4")
            determine_layer(reader, user_input, 7)
        else:
            print("Cannot be identified.")
get_data()